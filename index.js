//https://socket.io/docs/v4/server-application-structure/
//https://github.com/socketio/socket.io/blob/master/examples/chat/index.js#L68
let express = require('express');
let socket  = require("socket.io");
let app     = express();
let server  = app.listen(4000);
let messages = {};
let users = [];
app.use(express.static('public'));
numUsers = 0;
let io = socket(server);
io.on('connection', (socket) => {
    numUsers++;
    io.emit("history", {"messages":messages, "users":users});
    socket.on("new user", (uname) => {
        users.push(uname);
        io.emit("user joined", uname);
    });
    socket.on("disconnect", () => {
        numUsers--;
    });

    socket.on("getMessage", (data) => {
        if (Object.keys(messages).length >= 100) {
            delete messages[0];
            for (let i = 0; i < 100; i++) {
                messages[i] = messages[i+1];
                delete messages[i+1];
            }
        }
        messages[Object.keys(messages).length] = {"text": data["text"], "user": data["user"], "time": data["time"]};
        io.emit("messageRecieved", data);
    });
});
