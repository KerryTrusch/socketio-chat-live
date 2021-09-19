$(function(){
    const socket = io();
    const colors = [
        "#FFFFFF",
        "#E4E4E4",
        "#888888",
        "#222222",
        "#FFA7D1",
        "#E50000",
        "#E59500",
        "#A06A42",
        "#E5D900",
        "#94E044",
        "#02BE01",
        "#00D3DD",
        "#0000EA",
        "#820080"
    ];

    socket.emit("userJoin", "username");
});

