//https://socket.io/docs/v4/server-application-structure/
//https://github.com/socketio/socket.io/blob/master/examples/chat/index.js#L68
let express = require('express');
let socket  = require("socket.io");
let app     = express();
let server  = app.listen(4000);
let messages = {};
app.use(express.static('public'));

let io = socket(server);
io.on('connection', (socket) => {
    socket.on("pixelPlaced", (data) => {
        canvas[data.loc[0]][data.loc[1]] = data.COLOR;
        socket.broadcast.emit("updateBoard", canvas);
    });
});
