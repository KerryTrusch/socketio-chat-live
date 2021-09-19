let socket;
socket = io.connect("http://localhost:3000");
io.on('connection', (socket) => {
    io.on("updateBoard", (data) => {
        canvas = data;
    });
})


