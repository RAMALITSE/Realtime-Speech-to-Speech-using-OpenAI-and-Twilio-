import WebSocket from "ws";
import dotenv from "dotenv";
import fastify from "fastify";
import fastifyFormbody from "@fastify/formbody";
import fastifyWs from "@fastify/websocket";
import fastify from "fastify";
import { Messages } from "openai/resources/beta/threads/messages.mjs";
import { Models } from "openai/resources/models.mjs";


const {OPENAI_API_KEY} = process.env
dotenv.config();

if(OPENAI_API_KEY){
    console.error("Missing API key. Please set it in .env file");
    process.exit(1);

}

const fastify = Fastify();
fastify.register(fastifyFormbody);
fastify.register(fastifyWs);



const SYSYEM_MESSAGE = 'Your are a helpul and hubbly AI assistant who loves to caht about anything the user is instrested about and is prepared to ofer them facts. You have a penchant for dad jokes, owl jokes, and rickrolling - subtly. Always stay positive, ut work in a joke when approriate';

const VOICE = 'alloy';
const PORT = process.env.PORT || 5050;


fastify.get('/incoming-call', async(request, reply)=>{
    reply.send({Messages: 'Twilio Media Stream Server is running!'});

});

fastify.all('/incoming call', async(request, reply)=>{

    const twimlResponse = '<?xml version= "1.0" encoding = "UTF-8"?> <Response> <Say> Please wait while we connect your call to A. I. voice assistant, powered by Twilio and Open-A. I. Realtime API </Say> <Pause length = "1"/> <Say>O. k. you can start talking! </Say> <Connect><Stream url="wss://${request.headers.host}/media-stream"/><Connect><Response>';

    reply.type('text/xml').send(twimlResponse);
});

fastify.register(async(fastify)=> {
    fastify.get('/media-stream', {WebSocket: true}, (connection, req) =>{
        console.log('Client connected');

        const openaiWs = new WebSocket('wss://api.openai.com/v1/realtime? Model=gpt-4o-realtime-preview-2024-10-01',{
            headers: {
                Authorization: 'Bearer ${ OPENAI_KEY }',
                "OpenAI-Beta": "realtime=v1",
            },
    });

    let streamSid = null;

    const sendSessionUpdate = () =>{
         const sessionUpdate = {

            type: "session.update",
        session :{
            
        }
         }
    };

    });
});