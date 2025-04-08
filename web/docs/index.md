---
prev: false
next:
  text: 'Authentication'
  link: './authentication'
---

# Introduction

## Overview

Integration framework supports to define custom apps that can be used to add action, automation or await process to workspaces.

An app involves in two stages:

1. **Build time**: User adds a step to a workspace, by authentication and providing necessary inputs.
2. **Run time**: When the process is triggered. For action process, it is triggered by user clicking the action button. For other process, it is triggered when the step starts in the flow.

## Authentication

If the app needs to access external resources requiring authorization, it should be authenticated first. Now we supports two types of authentication, `OAuth2` and `Custom`, which can be configured in `Authorization` tab. The authorized credential will be passed to all app defined functions.

> Refer to [Authentication](./authentication.md) for more details.

After authentication, the app needs to provide an unique id and a display id for the credential. This can be configured in `Identity Function` tab. The identity function is a user defined script, integration framework will invoke it to get the identity information of the credential.

> Refer to [Identity Function](./identity-function.md) for more details.

```mermaid
%%{init: {'theme':'default'}}%%
sequenceDiagram
	actor C as Creator
	participant CL as Moxo Client
	participant IF as Integration Framework
	participant ES as External Service
	C->>CL: Add app to workspace
	CL->>IF: Get app's authentication configuration
	IF-->>CL: Authentication configturation
	alt If the authentication type is OAuth2
	CL-->>C: Open OAuth2 authorization web page
	C->ES: Authenticate
	ES-->>IF: Redirect to OAuth2 redirect URL
	IF->>ES: Get OAuth2 token
	ES-->>IF: OAuth2 token
	else If the authentication type is Custom
	CL-->>C: Display a form to ask creator to provide input
	C->>CL: Inputs
	CL->>IF: Inputs
  end
  IF-->>IF: Invoke identity function to get identity information
	IF-->>IF: Save credential
```

## Provide inputs and create process

The logic of asking user to provide inputs can be configured in `Build Function` tab. Like identity function, the build function is also a user defined script. The script should return a JSON object, consisting one of following fields:

1. form
2. action
3. automation
4. await

If the `form` field is returned, the user will be asked to fill the form, and the build function will be invoked again with the form data. This will be repeated until one of the other field is returned, which will be used to create the process.

> Refer to [Build Function](./build-function.md) for more details.

```mermaid
%%{init: {'theme':'default'}}%%
sequenceDiagram
	actor C as Creator
	participant CL as Moxo Client
	participant IF as Integration Framework
	participant S as Moxo Server
	CL->>IF: Invoke build function
	IF-->>IF: Invoke build function and get return value
	IF-->>CL: Return value
	loop If the return value is form
	CL-->>C: Ask creator to fill the form
	C->>CL: Form data
	CL->>IF: Invoke build function with form data
	IF-->>IF: Invoke build function and get return value
	IF-->>CL: Return value
	end
	CL-->>S: Create the step
```

## Handle process execution

This can be configured in `Action Function` tab. When the process is triggered, the action function will be invoked with authentication credential, inputs provided in build time, some context and two callback URLs:

1. Redirect URL
2. Webhook URL

There are three situations for the action function invocation:
1. Return the result, so that the process will be completed or failed.
2. Register the webhook url on external services, which should send a webhook request back after asynchronous operations finish.
3. For action process, return a `open_url` event, which asks Moxo client to open the url to the user, that url should take redirect url as a parameter, and should finally redirect to it after user finishes on that webpage.

> Refer to [Action Function](./action-function.md) for more details.

```mermaid
%%{init: {'theme':'default'}}%%
sequenceDiagram
	participant IF as Integration Framework
	participant S as Moxo Server
	participant ES as External Service
  participant CL as Moxo Client
  note over IF: Process is triggered
	IF-->>IF: Invoke action function and get return value
	alt If the return value contains result
	IF->>S: Complete or cancel the action or automation
	else If the return value contains `open_url` action
	IF-->>CL: External URL with `Redirect URL` as parameter
	CL-->>CL: Open external URL
	CL->>ES: Do something
	ES-->>IF: Redirect to `Redirect URL`
	else Register a webhook on external services
	IF->>ES: Register webhook
	ES-->>ES: Finish asynchronous operations
	ES-->>IF: Send webhook request to `Webhook URL`
	end
```

## Handle callback (optional)

### Handle Redirect

If the action function returns a `open_url` action, client will open the url, which should finally redirect to the redirect url. This step will be handled by script defined in `Redirect Function` tab.

> Refer to [Redirect Function](./redirect-function.md) for more details.

```mermaid
%%{init: {'theme':'default'}}%%
sequenceDiagram
	participant IF as Integration Framework
	participant S as Moxo Server
	participant ES as External Service
	ES-->>IF: Redirect to `Redirect URL`
	IF-->>IF: Invoke redirect function and get return value
	IF->>S: Complete or fail the action or automation
```

### Handle Webhook

If the action function registers a webhook, the external service should send a webhook request to the `Webhook URL` after asynchronous operations finish. This step will be handled by script defined in `Webhook Function` tab.

> Refer to [Webhook Function](./webhook-function.md) for more details.

```mermaid
%%{init: {'theme':'default'}}%%
sequenceDiagram
	participant IF as Integration Framework
	participant S as Moxo Server
	participant ES as External Service
	ES-->>IF: Send webhook request to `Webhook URL`
	IF-->>IF: Invoke webhook function and get return value
	IF->>S: Complete or fail the action or automation
```