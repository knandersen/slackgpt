# SlackGPT

This project builds a

Requirements:

- Slack instance (free)
- OpenAI API access
- NodeJS and somewhere to deploy (I use [Render](http://render.com))

This project is inspired by
[Morten Just and the idea of "team as code"](https://twitter.com/mortenjust/status/1638068433127366657).

# Usage

Follow the installation steps below to set up your Slack app and run the NodeJS
server locally or deployed somewhere.

The app will create a `@SlackGPT` user inside the slack instance. You interact
with the user by mentioning it in a channel. How the bot behaves inside a
channel depends on your configuration in [`channels.json`](/channels.json) where
you map a channel to a behavior, e.g.

Mentioning `@SlackGPT` in `#ai-copywriter` will cause the bot to prompt OpenAI
GPT using the following instruction:

> You are an AI copywriter assistant.
>
> - Follow the user's requirements carefully & to the letter.
> - First think step-by-step - describe your plan for what to write, written out
  > in great detail
> - Then output your writing in a single block
> - Minimise any other prose

# Installation

## 1. Set up Slack app and retrieve tokens

I followed this guide
[https://www.twilio.com/blog/how-to-build-a-slackbot-in-socket-mode-with-python]()
and adapted it slightly:

### 1.1 Create the Slackbot

1. Navigate to the [Slack apps dashboard](https://api.slack.com/apps) for the
   Slack API.
2. Click the **Create New App** button.
3. Select the option to create your app from scratch.
4. Enter a name for your bot, e.g., "Simple-Bot".
5. Select the workspace for your bot.
6. Click **Create App**.

### 1.2 Configure the Slackbot

1. Navigate to the **OAuth & Permissions** tab under Features.
2. Add the following scopes under Bot Token Scopes:
   - `app_mentions:read`
   - `calls:write`
   - `channels:join`
   - `chat:write`

### 1.3 Enable Socket Mode for the Slackbot

1. Navigate to the **Socket Mode** tab under Settings.
2. Toggle the button next to Enable Socket Mode.
3. Create an app level token, e.g., "simple_bot_app_token".
4. Click **Generate**.
5. Store the generated `SLACK_APP_TOKEN` securely.
6. Click **Done**.

### 1.4 Enable Event Subscriptions for the Slackbot

1. Navigate to **Event Subscriptions** under Features.
2. Enable events.
3. Expand the **Subscribe to bot events** section.
4. Click **Add Bot User Event**.
5. Select the `app_mention` event and save your changes.

### 1.5 Install the Slackbot to a workspace

1. Navigate to **Install App** under Settings.
2. Request to install the app (process may vary depending on your organization).
3. After approval, revisit the **Install App** tab.
4. Obtain and store the `SLACK_BOT_TOKEN` securely.

## 2. Generate OpenAI API key

1. Visit
   [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)
2. Create new secret key. This is your `OPENAI_API_TOKEN`

You should now have the Slack app set up and tokens available to deploy the bot
server.

## 3. Deploy NodeJS bot server

You can run the NodeJS bot server locally using `npm run start` or deploy it to
a service like Render:

### Render CLI

[Install the Render CLI](https://render.com/docs/cli) and run the following
command from the repository root:

`render blueprint launch`

### Deploy to Render manually

Go to the Render website, `Blueprints > New Blueprint instance` and put this
repository's link in the `Public Git repository` field:

`https://github.com/knandersen/slackgpt.git`

This will open the Render website and use this repo and the `render.yaml` as the
service blueprint. You will be prompted to enter the tokens generated in the
steps above as environment variable keys.
