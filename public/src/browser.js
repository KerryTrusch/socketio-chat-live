$(function () {
    const socket = io();
    let serverList = [];
    socket.emit("get servers");
    socket.on("servers", (data) => {
        for (let i = 0; i < data.length; i++) {
            $('<div>', {
                class: 'server_list'
            }.html(data[i]).append($('.server_menu_box')));
        }
    });
});