import OSC from "osc-js";

// Defines ports for the UDP and WebSocket servers
// UDP is for communication with Max
// WebSocket is for communication with the browser
const udpPort = 41236;
const wsPort = 3333;
const config = { udpClient: { port: udpPort }, wsServer: { port: wsPort } };

// This is code that bridges the WebSocket and UDP servers
const osc = new OSC({ plugin: new OSC.BridgePlugin(config) });

// This is code that lets us know when the WebSocket server is open
osc.on("open", () => {
	console.log(`OSC WebSocket is open on ws://localhost:${wsPort}`);
});

// This is code that runs when the server receives a message from the grid
osc.on("message", (message) => {
	// It prints the message to the terminal
	console.log(`Received message: ${message}`);

	// Then it sends the message to Max
	// Localhost is used because we're running both servers on the same machine
	osc.send(message, { host: "localhost", port: udpPort });
});

osc.open();
