// bot.js

require('dotenv').config();
const { App } = require('@slack/bolt');
const { WebClient } = require('@slack/web-api');
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const bot = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
});

const webClient = new WebClient(process.env.SLACK_BOT_TOKEN);

const monitoredChannels = JSON.parse(fs.readFileSync('channels.json', 'utf-8'));

bot.event('app_mention', async ({ event, context }) => {
    const channelId = event.channel;
    let promptPrefix;

    
    const channelInfo = await webClient.conversations.info({ channel: channelId });
    const channelName = "#" + channelInfo.channel.name;
    
    for (const ch of monitoredChannels) {
        if (channelName === ch.role) {
            promptPrefix = ch.promptPrefix;
            break;
        }
    }

    if (!promptPrefix) {
        return; // Ignore messages from other channels
    }

    await handleMessage(event, context, promptPrefix);
});

async function handleMessage(event, context, promptPrefix) {
    const userMessage = event.text.replace(`<@${context.botUserId}>`, '').trim();
    const gptResponse = await getGPTResponse(promptPrefix, userMessage);

    try {
        await webClient.chat.postMessage({
            channel: event.channel,
            text: gptResponse,
        });
    } catch (error) {
        console.error(error);
    }
}

async function getGPTResponse(promptPrefix, userPrompt) {
    try {
        const prompt = `${promptPrefix}\n${userPrompt}`;

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

bot.start();
