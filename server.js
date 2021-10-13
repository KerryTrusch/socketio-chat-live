const port = process.env.PORT || 3000;
let express = require('express');
let socket = require("socket.io");
let app = express();
const mongoose = require('mongoose');
let server = app.listen(port);

//Setting up mongoDB using mongoose
const uri = process.env.MONGODB_URI || "mongodb+srv://dbAdmin:B2f9bxS%40t7%40i93j@cluster0.rcn3r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(uri);
}

const messageSchema = new mongoose.Schema({
    text: String,
    user: String,
    time: String,
    color: String,
    imgsrc: String
});

const userSchema = new mongoose.Schema({
    name: String,
    id: String,
    room: String
});
const users = mongoose.model('User', userSchema);
// On server startup there should be no one connected, so we flush the collection
users.deleteMany({}, function(err) {});

let message;
async function getAllMessagesFromRoom(room) {
    message = mongoose.model('Message', messageSchema, room)
    return message.find({}).exec();
}

function addMessageToRoom(data, room) {
    message = mongoose.model('Message', messageSchema, room)
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
}

async function getUsersInRoom(rooms) {
    return users.find({room: rooms}).exec();
}
//Routing app to files in the public folder
app.use(express.static('public'));

let io = socket(server);

//Continually check for emits from the client
io.on('connection', (socket) => {

    socket.on("join room", (room) => {
        socket.join(room);
    });

    socket.on("new user", async (uname) => {
        const newUser = new users({
            name: uname["uname"],
            id: uname["id"],
            room: uname["room"]
        });
        await newUser.save(function (err) {if (err) console.log(err)});
        let messages = await getAllMessagesFromRoom(uname["room"]);
        let numUsers = await getUsersInRoom(uname["room"]);
        socket.emit("history", { "messages": messages, "users": numUsers, "numUsers": numUsers.length, "room":uname["room"] });
        socket.broadcast.to(uname["room"]).emit("user joined", { "newName": uname["uname"], "userId": uname["id"], "room": uname["room"] });
    });

    // We use disconnecting instead of the disconnect function because disconnecting allows us to grab the users rooms
    socket.on('disconnecting', () => {
        users.deleteOne({id: socket.id}, function(err) {if (err) console.log(err)});
        const rooms = Object.keys(socket.rooms);
        for (let i = 0; i < rooms.length; i++) {
            socket.broadcast.to(rooms[i]).emit("disconnected user", socket.id);
        }
    });

    socket.on("getMessage", (data) => {
        addMessageToRoom(data, data["room"]);
        io.to(data["room"]).emit("messageRecieved", data);
    });

    socket.on("get servers", () => {
        mongoose.connection.db.listCollections().toArray(function(err, names) {
            if (err) {
                console.log(err);
            }
            else {
                let arr = [];
                names.forEach(function(e,i,a) {
                    arr.push(e.name);
                });
                socket.emit("servers", arr);
            }
        });
    })
});
