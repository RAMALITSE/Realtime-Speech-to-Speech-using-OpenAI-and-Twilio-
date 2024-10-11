#  Realtime Speech to Speech using OpenAI an Twillio (Node.js)

The application demonstrates how to use Node.js, [Twilio Voice](https://www.twilio.com/docs/voice) and [Media Streams](https://www.twilio.com/docs/voice/media-streams), and [OpenAI's Realtime API](https://platform.openai.com/docs/) to make a phone call to speak with an AI Assistant. 

The application opens websockets with the OpenAI Realtime API and Twilio, and sends voice audio from one to the other to enable a two-way conversation.



The application uses the following Twilio products in conjuction with OpenAI's Realtime API:
- Voice (and TwiML, Media Streams)
- Phone Numbers

## Prerequisites

- **Node.js 18+** We used \`18.20.4\` for development; download from [here](https://nodejs.org/).
- **A Twilio account.** You can sign up for a free trial [here](https://www.twilio.com/try-twilio).
- **A Twilio number with _Voice_ capabilities.** [Here are instructions](https://help.twilio.com/articles/223135247-How-to-Search-for-and-Buy-a-Twilio-Phone-Number-from-Console)
- **An OpenAI account and an OpenAI API Key.** You can sign up [here](https://platform.openai.com/).
- **OpenAI Realtime API access.**

## Local Setup

steps to get the app up-and-running locally for development and testing:
1. Run ngrok to expose local server to the internet for testing.
2. Twilio setup
3. Update the .env file
