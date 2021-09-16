//https://socket.io/docs/v4/server-application-structure/
//https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers
// ^ if I want to go the redux route of using states to control the canvas
let express = require('express');
let socket = require("socket.io");
let app = express();
let server = app.listen(3000);

app.use(express.static('public'));

let io = socket(server);
io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log("new connection: " + socket.id);
}