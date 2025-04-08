---
prev:
  text: 'Function'
  link: './function'
next:
  text: 'Build Function'
  link: './build-function'
---


# Identity Function

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
  }
}
```

## Return value

The return value of identity function is an object containing a `output` field, which consists of two fields:

* `display_id`: The string to be displayed in Moxo client to indicate the identity
* `unique_id`: The unique id of the identity. This id will be used to save credential uniquely in server. You should always return the same `unique_id` for the same identity, and never return the same `unique_id` for different ones.

**Example**

```json
{
  "output": {
    "display_id": "Emily60",
    "unique_id": "07847fd7-d415-469b-8e85-42aea0a48e22"
  }
}
```

If error happens, the function should return an error object with a message field

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
exports.handler = async (parameters) => {
  console.log('parameters:', JSON.stringify(parameters));
  const credential = parameters.credential;
  // ...... your code here
  return {
    output: {
      display_id: 'Emily60',
      unique_id: '07847fd7-d415-469b-8e85-42aea0a48e22'
    }
  }
}
```