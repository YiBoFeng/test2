---
prev:
  text: 'Redirect Function'
  link: './redirect-function'
next:
  text: 'Form Input Schema'
  link: './form-input-schema'
---

# Webhook Function

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
  "input": {
    // The Content-Type http header of the request
    "content_type": "application/json",
    // base64 encoded string of the request body
    "body_base64": "xxx"
  }
}
```

## Return value

The return value of Webhook Function is same as [Redirect Function](./redirect-function.md), except

1. open_url event can not be triggerred.
2. Error will not display.
3. Include the callback.token from action function's arguments to indicate which action the redirect function is called from.

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
  const contentType = input.content_type;
  const bodyBase64 = input.body_base64;
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