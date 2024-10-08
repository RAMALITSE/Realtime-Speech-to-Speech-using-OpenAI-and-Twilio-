import WebSocket from "ws";
import dotenv from "dotenv";
import fastify from "fastify";
import fastifyFormbody from "@fastify/formbody";
import fastifyWs from "@fastify/websocket";

dotenv.config();

const { OPENAI_API_KEY } = process.env;
if (OPENAI_API_KEY) {
    console.error("Missing API key. Please set it in .env file");
    process.exit(1);
}

const app = fastify();
app.register(fastifyFormbody);
app.register(fastifyWs);

const SYSYEM_MESSAGE =
    "Your are a helpul and hubbly AI assistant who loves to caht about anything the user is instrested about and is prepared to ofer them facts. You have a penchant for dad jokes, owl jokes, and rickrolling - subtly. Always stay positive, ut work in a joke when approriate";

const VOICE = "alloy";
const PORT = process.env.PORT || 5050;

fastify.get('/', async (request, reply) => {
    reply.send({ Messages: 'Twilio Media Stream Server is running!' });
});

fastify.all('/incoming call', async (request, reply) => {
    const twimlResponse =
        '<?xml version= "1.0" encoding = "UTF-8"?> <Response> <Say> Please wait while we connect your call to A. I. voice assistant, powered by Twilio and Open-A. I. Realtime API </Say> <Pause length = "1"/> <Say>O. k. you can start talking! </Say> <Connect><Stream url="wss://${request.headers.host}/media-stream" /><Connect></Response>';

    reply.type("text/xml").send(twimlResponse);
});

fastify.register(async (fastify) => {
    fastify.get("/media-stream", { WebSocket: true }, (connection, req) => {
        console.log("Client connected");

        const openAiWs = new WebSocket(
            "wss://api.openai.com/v1/realtime? Model=gpt-4o-realtime-preview-2024-10-01",
            {
                headers: {
                    Authorization: "Bearer ${ OPENAI_KEY }",
                    "OpenAI-Beta": "realtime=v1",
                },
            }
        );

        let streamSid = null;

        const sendSessionUpdate = () => {
            const sessionUpdate = {
                type: "session.update",
                session: {
                    turn_detection: {type: "server_vad"},
                    input_audio_format: "g711_ulaw",
                    output_audio_format: "g711_ulaw",
                    voice : VOICE,
                    instructions: SYSYEM_MESSAGE,
                    modalities: ["text","audio"],
                    temperature: 0.8,
                },
            };

            console.log("Sending session update:", JSON.stringify(sessionUpdate));
            openAiWs.send(JSON.stringify(sessionUpdate));
        };

        openAiWs.on("open", ()=>{
            console.log("Connected to the OpenAI Realtime API");
            setTimeout(sendSessionUpdate, 1000);
        });

        openAiWs.on("Message", (data));

        try {
            
            const response = JSON.parse(data);

            if(response.type === "session.update"){

                console.log("Session updated successfully:", response);

            }

            if(response.type === "response.audio.delta" && response.delta){
                const audioDelta = {
                    event : "media",
                    streamSid : streamSid,
                    media:{
                        payload: Buffer.from(response.delta, "base64").toString("base64")
                    }
                };

                connection.send(JSON.stringify(audioDelta));

            }
        } catch (error) {

            console.error("Error processing OpenAI message:", error, "Raw message:", data);
            
        }
    });

    connection.on("message", (message) =>{
        try {

            const data = JSON.parse(message);

            switch (data.event) {
                case "start":
                    streamSid = data.start.streamSid;
                    console.log("Incoming stream has started", streamSid);
                    break;
                case "media":
                    if (openAiWs.readyState === WebSocket.OPEN) {
                        const audioAppend ={
                            type: "input_audio_buffer.append",
                            audio: deta.media.payload,
                        };

                        openAiWs.send(JSON.stringify(audioAppend));
                        
                    }
                    break
            
                default:
                 console.log("Receive non-media even: ", data.event);
            }
            
        } catch (error) {

            console.error("Error parsing message: ",error, "Message: ", message)
            
        }

    });

    connection.on("close", ()=>{
        if (openAiWs.readyState === WebSocket.OPEN) openAiWs.close(); 

    });

    openAiWs.on("erro", (error) =>{

        console.log("Disconnected from the OpenAI Realtime API");
    });

    openAiWs.on("error", (error) =>{
     
        console.error("Error in thr OpenAI Websocket: ", error);
    });

});

app.listen({port : PORT }, (errr) =>{
    if(err){
        console.error(err);
        process.exit(1);


    }

    console.log('Server is listing on port ${PORT}');
});
