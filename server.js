const port = process.env.PORT || 3000;
let express = require('express');
let socket = require("socket.io");
let app = express();
const mongoose = require('mongoose');
let server = app.listen(port);
let messages = [];
let users = {};

//Route to a particular room; this pulls from a mongoDB collection of those messages
let room = "global_room";

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
const message = mongoose.model('Message', messageSchema, room);

//Message prepopulation done async to prevent users that join quickly from not recieving data
function updateMessageStorage() {
    message.find({}).exec(function (err, models) {
        if (err) {
            console.log(err);
        } else {
            messages = [];
            (async function () {
                for await (let key of models) {
                    messages.push(key);
                }
            })();
        }
    });
}
updateMessageStorage();
//Routing app to files in the public folder
app.use(express.static('public'));


numUsers = 0;
let io = socket(server);

//Continually check for emits from the client
io.on('connection', (socket) => {
    numUsers++;
    io.emit("num users up", numUsers);

    io.emit("history", { "messages": messages, "users": users, "numUsers": numUsers });

    socket.on("new user", (uname) => {
        users[uname["id"]] = uname["uname"];
        io.emit("user joined", { "newName": uname["uname"], "userId": uname["id"] });
    });

    socket.on("disconnect", () => {
        numUsers--;
        delete users[socket.id]
        io.emit("num users down", numUsers);
        io.emit("disconnected user", socket.id);
    });

    socket.on("getMessage", (data) => {
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
