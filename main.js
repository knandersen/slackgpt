// Modify the bot.js file

// Import additional required modules
require('dotenv').config();
const { App } = require('@slack/bolt');
const { WebClient } = require('@slack/web-api');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Initialize the Slack bot
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
});

// Implement event listener for app_mention event
app.event('app_mention', async ({ event, context }) => {
    await handleMessage(event, context);
});

// Modify the handleMessage function
async function handleMessage(event, context) {
    const webClient = new WebClient(context.botToken);
    const userMessage = event.text.replace(`<@${context.botUserId}>`, '').trim();
    const gptResponse = await getGPTResponse(userMessage);

    try {
        await webClient.chat.postMessage({
            channel: event.channel,
            text: gptResponse,
        });
    } catch (error) {
        console.error(error);
    }
}

// Create a function to send the user's message to OpenAI GPT API and get a completion result
async function getGPTResponse(prompt) {
    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 3500,
            n: 1,
            temperature: 0.5,
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error(error);
        return 'Error: Unable to get a response from OpenAI GPT API.';
    }
}

// Start the Node.js server
(async () => {
    await app.start();
    console.log('Slack bot is running!');
})();
