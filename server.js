import OSC from "osc-js";

const udpPort = 41236;
const wsPort = 3333;
const config = { udpClient: { port: udpPort }, wsServer: { port: wsPort } };
const osc = new OSC({ plugin: new OSC.BridgePlugin(config) });

osc.on("open", () => {
	console.log(`OSC WebSocket is open on ws://localhost:${wsPort}`);
});

osc.on("message", (message) => {
	console.log(`Received message: ${message}`);
	osc.send(message, { host: "localhost", port: udpPort });
});

osc.open();
