---
prev:
  text: 'Authentication'
  link: './authentication'
next:
  text: 'Identity Function'
  link: './identity-function'
---

# Function

All functions are node scripts. The script should export a `handler` which is a function that have different arguments and return type based on the function type.

* [Identity Function](./identity-function.md)
* [Build Function](./build-function.md)
* [Action Function](./action-function.md)
* [Redirect Function](./redirect-function.md)
* [Webhook Function](./webhook-function.md)

There are two ways you can configure a function
1. **Code**: Write the function code directly in the developer portal.
2. **Zip File**: Upload a zip file containing the function code. The zip file should contain the `index.js` file at the root level. The `index.js` file should export the `handler` function. If your function has dependencies, you can include them in the zip file. This method is useful when you want to use other npm packages in your function. The zip directory structure should look like this:
    ```
    .
    ├── index.js
    |── package.json
    ├── node_modules
    │   ├── package1
    │   ├── package2
    │   └── ...
    ```