---
prev:
  text: 'Webhook Function'
  link: './webhook-function'
next: false
---

# Form Input Schema

The `default` field's schema is also the schema of the value that will be passed to the function.

## string

One line text

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://fwdev.coderhour.com/integration/schemas/framework/inputs/string",
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "string"
    },
    "key": {
      "type": "string"
    },
    "label": {
      "type": "string"
    },
    "tip": {
      "type": "string"
    },
    "required": {
      "type": "boolean",
      "default": true
    },
    "default": {
      "type": "string"
    },
    "placeholder": {
      "type": "string"
    }
  },
  "required": [
    "type",
    "key",
    "label"
  ]
}
```

## text

Multi line text

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://fwdev.coderhour.com/integration/schemas/framework/inputs/text",
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "text"
    },
    "key": {
      "type": "string"
    },
    "label": {
      "type": "string"
    },
    "tip": {
      "type": "string"
    },
    "required": {
      "type": "boolean",
      "default": true
    },
    "default": {
      "type": "string"
    },
    "placeholder": {
      "type": "string"
    }
  },
  "required": [
    "type",
    "key",
    "label"
  ]
}
```

## number

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://fwdev.coderhour.com/integration/schemas/framework/inputs/number",
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "number"
    },
    "key": {
      "type": "string"
    },
    "label": {
      "type": "string"
    },
    "tip": {
      "type": "string"
    },
    "required": {
      "type": "boolean",
      "default": true
    },
    "default": {
      "type": "string"
    },
    "placeholder": {
      "type": "string"
    }
  },
  "required": [
    "type",
    "key",
    "label"
  ]
}
```

## date

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://fwdev.coderhour.com/integration/schemas/framework/inputs/date",
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "date"
    },
    "key": {
      "type": "string"
    },
    "label": {
      "type": "string"
    },
    "tip": {
      "type": "string"
    },
    "required": {
      "type": "boolean",
      "default": true
    },
    "default": {
      "type": "string",
      "format": "date"
    },
    "placeholder": {
      "type": "string",
    }
  },
  "required": [
    "type",
    "key",
    "label"
  ]
}
```

## time

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://fwdev.coderhour.com/integration/schemas/framework/inputs/time",
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "time"
    },
    "key": {
      "type": "string"
    },
    "label": {
      "type": "string"
    },
    "tip": {
      "type": "string"
    },
    "required": {
      "type": "boolean",
      "default": true
    },
    "default": {
      "type": "string",
      "format": "time"
    },
    "placeholder": {
      "type": "string",
    }
  },
  "required": [
    "type",
    "key",
    "label"
  ]
}
```

## date-time

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://fwdev.coderhour.com/integration/schemas/framework/inputs/date-time",
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "date-time"
    },
    "key": {
      "type": "string"
    },
    "label": {
      "type": "string"
    },
    "tip": {
      "type": "string"
    },
    "required": {
      "type": "boolean",
      "default": true
    },
    "default": {
      "type": "string",
      "format": "date-time"
    },
    "placeholder": {
      "type": "string",
    }
  },
  "required": [
    "type",
    "key",
    "label"
  ]
}
```

## select

Single select
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://fwdev.coderhour.com/integration/schemas/framework/inputs/select",
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "select"
    },
    "key": {
      "type": "string"
    },
    "label": {
      "type": "string"
    },
    "tip": {
      "type": "string"
    },
    "required": {
      "type": "boolean",
      "default": true
    },
    "default": {
      "type": "string",
    },
    "placeholder": {
      "type": "string",
    },
    "props": {
      "type": "object",
      "properties": {
        "options": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "label": {
                "type": "string"
              },
              "value": {
                "type": "string"
              }
            },
            "required": [
              "label",
              "value"
            ]
          }
        }
      },
      "required": [
        "options"
      ]
    }
  },
  "required": [
    "type",
    "key",
    "label",
    "props"
  ]
}
```
## multi-select

Multiple select
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://fwdev.coderhour.com/integration/schemas/framework/inputs/select",
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "multi-select"
    },
    "key": {
      "type": "string"
    },
    "label": {
      "type": "string"
    },
    "tip": {
      "type": "string"
    },
    "required": {
      "type": "boolean",
      "default": true
    },
    "default": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "placeholder": {
      "type": "string",
    },
    "props": {
      "type": "object",
      "properties": {
        "options": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "label": {
                "type": "string"
              },
              "value": {
                "type": "string"
              }
            },
            "required": [
              "label",
              "value"
            ]
          }
        }
      },
      "required": [
        "options"
      ]
    }
  },
  "required": [
    "type",
    "key",
    "label",
    "props"
  ]
}
```


## file

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://fwdev.coderhour.com/integration/schemas/framework/inputs/select",
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "const": "file"
    },
    "key": {
      "type": "string"
    },
    "label": {
      "type": "string"
    },
    "tip": {
      "type": "string"
    },
    "required": {
      "type": "boolean",
      "default": true
    },
    "default": {
      "type": "object",
      "properties": {
        "@moxo.file": {
          "type": "object",
          "properties": {
            "files": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "url": {
                    "type": "string"
                  }
                },
                "required": [
                  "url"
                ]
              }
            }
          },
          "required": [
            "files"
          ]
        }
      },
      "required": [
        "@moxo.file"
      ]
    }
  },
  "required": [
    "type",
    "key",
    "label"
  ]
}
```

## heading (read only)

This is a read only field, which can be used to display title, description etc.

```json
{
  "$schema":"http://json-schema.org/draft-07/schema#",
  "$id":"https://fwdev.coderhour.com/integration/schemas/framework/inputs/heading",
  "type":"object",
  "properties":{
    "type":{
      "type":"string",
      "const":"heading"
    },
    "key":{
      "type":"string"
    },
    "props":{
      "type":"object",
      "properties":{
          "title":{
            "type":"string"
          },
          "description":{
            "type":"string"
          }
      },
      "minProperties":1
    }
  },
  "required":[
    "type",
    "key",
    "props"
  ]
}
```
