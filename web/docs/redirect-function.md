---
prev:
  text: 'Action Function'
  link: './action-function'
next:
  text: 'Webhook Function'
  link: './webhook-function'
---

# Redirect Function

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
  // input contains all query parameters in the redirect url
  // the redirect url is https://xxx?query1=xxx&query2=xxx for this example
  "input": {
    "query1": "xxx",
    "query2": "xxx"
  }
}
```

## Return value

The return value of Redirect Function is same as [Action Function](./identity-function.md), except
1. open_url event can not be triggerred.
2. Error will not display.
3. Include the callback.token from action function's arguments to indicate which run time the redirect function is associated with.

    ```json
    {
      "output": {
        "status": "completed",
        "events": [
          {
            "type": "send_message",
            "options": {
              "text": "xxx"
            }
          }
        ]
      },
      "callback": {
        "token": "xxx"
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
      "status": "completed",
      "events": [
      	{
          "type": "send_message",
          "options": {
            "text": "xxx"
          }
      	}
      ]
    }
  }
}
```