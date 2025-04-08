---
prev:
  text: 'Overview'
  link: './index'
next:
  text: 'Identity Function'
  link: './identity-function'
---

# Authentication

We support two types of Authentication configuration, `OAuth2` and `Custom`. You can configure it in `Authentication` tab. This determines how your app interact with the user to authenticate.

## OAuth2

To add OAuth2 authentication to your app, select OAuth2 from the authentication scheme drop-down.

You’ll need the following items to add OAuth authentication:

* An OAuth application configured in your own app's settings, where you'll add Moxo's OAuth Redirect URL.
* A Client ID (may be called Customer or API Key) and Client Secret (may be called Customer or API secret) from your app.
* An Authorization URL on your app’s site where users will log in with their account credentials.
* An Access Token Request URL where Moxo exchanges the request token for an access token.
* A Refresh Token Request URL (optional) where Moxo can refresh the access token if it expires.
* A Test API endpoint where Moxo can make an API call to ensure your user credentials work.

When you configure a request's url, queries, headers or body, you can use the following variables:
* <span v-pre>`{{client_id}}`</span>: The client id of your app.
* <span v-pre>`{{client_secret}}`</span>: The client secret of your app.
* <span v-pre>`{{redirect_uri}}`</span>: The redirect uri of your app.
* <span v-pre>`{{code}}`</span>: Authorization code.
* <span v-pre>`{{access_token}}`</span>: Access token.
* <span v-pre>`{{refresh_token}}`</span>: Refresh token.
* <span v-pre>`{{query.${queryName}}}`</span>: This is used to get the value of a query parameter from the OAuth2 redirect request. For example, if the redirect request URL is `https://example.com?realmId=123`, then <span v-pre>`{{query.realmId}}`</span> will be `123`.

You should never update `state` in authorization, because it is used by Moxo internally.

## Custom

To add custom authentication to your app, select CUSTOM from the authentication scheme drop-down.

You can add any number of inputs required by your custom authentication. Each input consists of:
* **label:** Label will be displayed next to the input.
* **tip:** Tip of the input.
* **key:** The key determines how you refer to the input in the credential data structure. For example
  ```json
  {
    "credential": {
      "custom": {
        "custom_key_1": "value1",
        "custom_key_2": "value2"
      }
    }
  }
  ```