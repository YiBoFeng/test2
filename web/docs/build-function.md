---
prev:
  text: 'Identity Function'
  link: './identity-function'
next:
  text: 'Action Function'
  link: './action-function'
---

# Build Function

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
    "title": "xxx", // action only
    "description": "xxx", // action only, optional
    "assignees": [ // action only
      {
        "user": {
          "id": "xxx",
          "name": "xxx",
          "email": "xxx", // optional
          "phone_number": "xxx" // optional
        }
      },
      // if it is a role in flow template
      {
        "role": {
          "id": "xxx"
        }
      }
    ]
  },
  "input": {
    // custom input from previous forms
    "custom_key_1": "xxx",
    "custom_key_2": "xxx"
  }
}
```

## Return value

The return value of Build Function is an object containing an `output` field , which consists of one of the following fields:

* `form`: Client will render this form to ask user for more inputs. A form's data will override data from previous forms if inputs have the same key.
	> For input schema, refer to [Form Input Schema](./form-input-schema.md) for more details.
* `action`: Client will create an action with this action object.
* `automation`: Client will create an automation with this automation object.
* `await`: Client will create an await with this await object.
* `variables` (automation and trigger only): Declare variables that the automation will provided, which can be referenced by subsequent steps. Two types of variables are supported: `string` and `file`.

**Example**

* form

  ```json
  {
    "output": {
      "form": [
        // form inputs
        // ...
      ],
      "no_more_forms": true // By default it is false, set it to true to indicate no more forms
    }
  }
  ```

* action

  ```json
  {
    "output": {
      "action": {
        "title": "xxxx",
        "description": "xxx",
        "steps": [
          {
            "assignee": {
              "user": {
                "id": "xxx"
              },
              // if it is role in flow template
              // "role": {
                // "id": "xxx"
              // }
            },
            "buttons": [
              {
                "title": "xxx",
                "style": "default", // or 'branding', display style
                "input": { // input will be carried when user clicks this button
                  "any_custom_key1": "value1",
                  "any_custom_key2": "value2"
                }
              }
            ],
            "order_number": 1
          },
          // ...more steps
        ]
      }
    }
  }
  ```

* automation

  ```json
  {
    "output": {
      "automation": {
        "description": "xxx" // describe the automation
      },
      "variables": [
        {
          "key": "xxx",
          "label": "xxx",
          "type": "string"
        },
        {
          "key": "xxx",
          "label": "xxx",
          "type": "file"
        }
      ]
    }
  }
  ```

* await

  ```json
  {
    "output": {
      "await": {
        "description": "xxx" // describe the await
      },
      "variables": [
        {
          "key": "xxx",
          "label": "xxx",
          "type": "string"
        },
        {
          "key": "xxx",
          "label": "xxx",
          "type": "file"
        }
      ]
    }
  }
  ```

* trigger

```json
{
  "output": {
    "variables": [
      {
        "id": "xxx",    // External service name + external data's original ID, e.g. "salesforce-0065j00000BXZZAA4"
        "key": "xxx",
        "label": "xxx",
        "sample_value": "xxx",  // Sample value shown in trigger data mapping page
        "type": "string"
      }
    ]
  }
}
  ```

For app with OAuth2 authentication, integration framework will refresh token for you. In edge cases, the token is valid while checking, but expired when you use in your code, in which case you can return a `refresh_token` directive to ask integration framework to refresh (For example you encounter a 401 error). Integration framework will refresh token at most once in one function call, if you return `refresh_token` directive again, it will be ignored.

**Example**

```json
{
  "directive": {
    "type": "refresh_token"
  }
}
```

You can return `error` to display error message to the user, this has no use for automation because automation does not interact with user.

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
  // ...do something
  return {
    "output": {
      "form": [
        {
          "type": "string",
          "name": "Address Line 1",
          "key": "address_line1",
          "description": "Please enter your address",
          "is_required": true
        },
        // ...more input field
      ]
    }
  }
}
```