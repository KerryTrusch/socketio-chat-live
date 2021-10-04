const port = process.env.PORT || 3000;
let express = require('express');
let socket = require("socket.io");
let app = express();
const mongoose = require('mongoose');
let server = app.listen(port);
let messages = [];
let users = {};

//Setting up mongoDB using mongoose
const uri = process.env.MONGODB_URI || "mongodb+srv://dbAdmin:B2f9bxS%40t7%40i93j@cluster0.rcn3r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(uri);
}

//Setting the schema for a message object
const messageSchema = new mongoose.Schema({
    text: String,
    user: String,
    time: String,
    color: String,
    imgsrc: String
});
const message = mongoose.model('Message', messageSchema, 'message');
message.find({}).exec(function (err, models) {
    if (err) {
        console.log(err);
    } else {
        (async function () {
            for await (let key of models) {
                messages.push(key);
            }
        })();
    }
});
//Routing app to files in the public folder
app.use(express.static('public'));


numUsers = 0;
let io = socket(server);

//Continually check for emits from the client
io.on('connection', (socket) => {
    numUsers++;
    io.emit("num users up", numUsers);

    io.emit("history", { "messages": messages, "users": users, "numUsers": numUsers });

    socket.on("new user", async (uname) => {
        users[uname["id"]] = uname["uname"];
        io.emit("user joined", { "newName": uname["uname"], "userId": uname["id"] });
    });

    socket.on("disconnect", () => {
        numUsers--;
        delete users[socket.id]
        io.emit("num users down", numUsers);
        io.emit("disconnected user", socket.id);
    });

    //I only want to store 100 messages at a time so I pop the bottom element if we are at 100
    socket.on("getMessage", (data) => {
        // if (Object.keys(messages).length >= 100) {
        //     delete messages[0];
        //     for (let i = 0; i < 100; i++) {
        //         messages[i] = messages[i + 1];
        //         delete messages[i + 1];
        //     }
        // }
        // messages[Object.keys(messages).length] = { "text": data["text"], "user": data["user"], "time": data["time"], "color": data["color"], "imgsrc": data["imgsrc"] };
        const newMessage = new message({
            text: data["text"],
            user: data["user"],
            time: data["time"],
            color: data["color"],
            imgsrc: data["imgsrc"]
        });
        newMessage.save(function (err) {
            if (err) console.log(err);
        });
        messages.push(newMessage);
        io.emit("messageRecieved", data);
    });

    socket.on("get users", () => {
        socket.emit("users sent", users);
    })
});
