//https://socket.io/docs/v4/server-application-structure/
//https://github.com/socketio/socket.io/blob/master/examples/chat/index.js#L68
let express = require('express');
let socket  = require("socket.io");
let app     = express();
let server  = app.listen(4000);
let messages = {};
app.use(express.static('public'));
numUsers = 1;
let io = socket(server);
io.on('connection', (socket) => {
    socket.on("userJoin", () => {
        numUsers++;
        socket.emit("pastMessages", messages);
    });
    console.log(numUsers);
    socket.on("disconnect", () => {
        numUsers--;
    });

    socket.on("getMessage", (text, user, time) => {
        if (Object.keys(messages).length >= 100) {
            delete messages[0];
            for (let i = 0; i < 100; i++) {
                messages[i] = messages[i+1];
                delete messages[i+1];
            }
        }
        messages[Object.keys(message).length] = {"text": text, "user": user, "time": time};
    });
});
