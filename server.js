const port = process.env.PORT || 3000;
let express = require('express');
let socket  = require("socket.io");
let app     = express();
let server  = app.listen(port);
let messages = {};
let users = {};
//Routing app to files in the public folder
app.use(express.static('public'));


numUsers = 0;
let io = socket(server);

//Continually check for emits from the client
io.on('connection', (socket) => {
    numUsers++;
    io.emit("num users up", numUsers);
    io.emit("history", {"messages":messages, "users":users, "numUsers":numUsers});
    socket.on("new user", (uname) => {
        users[uname["id"]] = uname["uname"];
        io.emit("user joined", {"newName": uname["uname"], "userId":uname["id"]});
    });
    socket.on("disconnect", () => {
        numUsers--;
        delete users[socket.id]
        io.emit("num users down", numUsers);
        io.emit("disconnected user", socket.id);
    });
    
    //I only want to store 100 messages at a time so I pop the bottom element if we are at 100
    socket.on("getMessage", (data) => {
        if (Object.keys(messages).length >= 100) {
            delete messages[0];
            for (let i = 0; i < 100; i++) {
                messages[i] = messages[i+1];
                delete messages[i+1];
            }
        }
        messages[Object.keys(messages).length] = {"text": data["text"], "user": data["user"], "time": data["time"], "color": data["color"], "imgsrc": data["imgsrc"]};
        io.emit("messageRecieved", data);
    });

    socket.on("get users", () => {
        socket.emit("users sent", users);
    })
});
