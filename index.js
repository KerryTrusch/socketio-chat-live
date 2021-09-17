//https://socket.io/docs/v4/server-application-structure/
//https://github.com/socketio/socket.io/blob/master/examples/chat/index.js#L68
let express = require('express');
let mongo   = require('mongodb').MongoClient;
let socket  = require("socket.io");
let app     = express();
let server  = app.listen(4000);

app.use(express.static('public'));

mongo.connect('mongodb://127.0.0.1/Bitcanvas', function(err, db){
    if(err){
        throw err;
    }
    console.log('connected');
});

let io = socket(server);
io.on('connection', (socket) => {
    
});
