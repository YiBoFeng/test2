---
prev:
  text: 'Build Function'
  link: './build-function'
next:
  text: 'Redirect Function'
  link: './redirect-function'
---

# Action Function

## Parameter

**Example**

```json
{
  "credential": {
    "oauth2": {
      "access_token": "xxx",
      "refresh_token": "xxxx", // optional
      "expires_in": "3600", // optional
      "token_type": "Bearer",
      "scope": "xxx", // optional
      "redirect_queries": [ // optional, queries of OAuth2 redirect request
        {
          "name": "name1",
          "value": "value1"
        },
        // ...
      ]
    },
    // or
    "custom": {
      "custom_key_1": "value1",
      "custom_key_2": "value2"
    }
  },
  "identity": {
    // the unique_id returned from identity function
    "unique_id": "xxx"
  },
  "context": {
    "action_key": "action_key",
    // automation and await only, indicates the number of attempts to execute the process.
    "attempts": 1,
    // trigger only, a string records the last state of API polling, e.g. created date
    "state": "xxx",
    // trigger only, the active time of trigger template
    "trigger_activation_time": 1742277460000,  
    // action only
    "assignees": [
      {
        "user": {
          "id": "xxx",
          "name": "xxx",
          "email": "xxx", // optional
          "phone_number": "xxx" // optional
        }
      }
      // ....
    ],
    // Deprecated. Use variables instead.
    // automation only
    // attachments, signature or form's converted file..
    "resources": [
      {
        "name": "xxx",
        "url": "xxx"
      }
    ],
    // Deprecated. Use variables instead.
    // If the automation's action object is a transaction,
    // the transaction object is same as rest api
    "transaction": {

    },
    // Deprecated. Use variables instead.
    // If the automation's action object is a signature
    // the signature object is same as rest api
    "signature": {

    },
    // Deprecated. Use variables instead.
    // If the automation's action object is a todo
    // the todo object is same as rest api
    "todo": {

    }
  },
  // For action app, it is the input property of the user clicked button, you set it in build function.
  // For automation app, it is user inputs for forms returned by build function.
  "input": {
    "custom_key_1": "xxx",
    "custom_key_2": "xxx"
  },
  "callback": {
    "token": "xxx",
    "redirect": "https://xxx", // action only
    "webhook": "https://xxx"
  }
}
```

**Note:** The redirect and webhook are the same for a specific app and external service identity, you should check whether those endpoints are already set in the external service before you set them.

## Return value

The return value of Action Function is an object containing an `output` field , which consists of:

* `status`: (Optional) The status of the action. If you don't return status in action function, it means the final result will be determined by the redirect or webhook callback. Status can be one of the following values:
	* `completed`: The action step or automation is completed.
	* `cancelled`: The action step or automation is cancelled.
	* `message` (Optional, automation only): The display error message.
* `events`: (Optional, action process only) A list of events will be triggered on return. An event could be:
	* Send message
	* Upload attachment
	* Ask Moxo client to open a url
* `form`: (Optional, action only) Same as the form in build function's return value.
* `retry`: (Optional, automation await and trigger only) The automation or await process will be retried after specified seconds.
* `variables`: (Optional, automation only) Provide values for variables declared in build function.
* `state`: (Optional, trigger only) A string records the last state of API polling, e.g. created date
* `variable_groups`: (Optional, trigger only) A list of variable groups, each group contains a set of variables.
**Example**

```json
{
  "output": {
    "status": "completed", // cancelled
    // automation only
    "message": "xxx",
    // action only
    "events": [
      {
        "type": "send_message",
        "options": {
          "text": "xxx"
        }
      },
      {
        // Framework will use url and headers to get the attachment
        "type": "upload_attachment",
        "options": {
          "file_name": "xxx",
          "mime_type": "xxx",
          "url": "xxx",
          "headers": [
            {
              "name": "header name1",
              "value": "header value1"
            },
            {
              "name": "header name2",
              "value": "header value2"
            }
          ]
        }
      },
      {
        "type": "open_url",
        "options": {
          "url": "xxx",
          "open_type": "webview" // Default is "redirect".
          // If the value is "webview", the url will be opened via iframe for web app, and via build-in webview for mobile app.
          // If the value is "redirect", the url will be opened in a new tab.
        }
      }
    ],
    // automation/await/trigger only
    "retry": {
      "delay": 60 // seconds
    },
    // automation only
    "variables": [
      {
        "key": "xxxx",
        "value": "xxx"
      },
      {
        "key": "xxx",
        "files": [
          {
            "url": "xxx",
            "file_name": "xxx",
            "mime_type": "xxx",
            "headers": [
              {
                "name": "header name1",
                "value": "header value1"
              },
              {
                "name": "header name2",
                "value": "header value2"
              }
            ]
          },
          {
            "url": "xxx",
            "file_name": "xxx",
            "mime_type": "xxx",
            "headers": [
              {
                "name": "header name1",
                "value": "header value1"
              },
              {
                "name": "header name2",
                "value": "header value2"
              }
            ]
          }
        ]
      }
    ],
    // trigger only
    "state": "xxx",
    // trigger only
    "variable_groups": [
      {
        "variables": [
          {
            "id": "xxx",
            "key": "xxx",
            "label": "xxx",
            "type": "string",
            "value": "xxx"
          }
        ]
      },
      {
        "variables": [
          {
            "id": "xxx",
            "key": "xxx",
            "label": "xxx",
            "type": "string",
            "value": "xxx"
          }
        ]
      }
    ],
  }
}
```

For app with OAuth2 authentication, integration framework will refresh token for you. In edge cases, the token is valid while checking, but expired when you use in your code, in which case you can return a `refresh_token` directive to ask integration framework to refresh (For example you encounter a 401 error). Integration framework will refresh token at most once in one function call, if you return `refresh_token` directive again, it will fail.

**Example**

```json
{
  "directive": {
    "type": "refresh_token"
  }
}
```

For action app, you can return `error` to display error message to the user.

**Example**

```json
{
  "error": {
    "title": "Display error title",
    "description": "Display error description"
  }
}
```

## Code Example

The function is a node module, which exports an async function `handler`. The function receives an object as parameter, and returns an object as return value.

```javascript
exports.handler = async function (parameters) {
  console.log('parameters:', JSON.stringify(parameters));
  const credential = parameters.credential;
  const input = parameters.input;
  const callback = parameters.callback;
  const redirectUrl = callback.redirect;
  // ...do something
  return {
    "output": {
      // "status": "completed",
      "events": [
        {
          "type": "send_message",
          "options": {
            "text": "xxx"
          }
        },
        {
          "type": "open_url",
          "options": {
            "url": `https://xxx?redirect_uri=${encodeURIComponent(redirectUrl)}`
          }
        }
      ]
    }
  }
}
```