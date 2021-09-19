$(function () {
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
    let messages;
    socket.username = "user";
    const uname = socket.username;
    form = document.getElementById('form');
    input = document.getElementById('chatbar');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (input.value) {
            messages = new message(input.value);
            socket.emit('getMessage', { "text": messages.body, "user": uname, "time": messages.time });
            input.value = '';
        }
    });

    socket.on("messageRecieved", (body) => { 
        let textBox = document.createElement('textbox');
        let message = document.createElement('p');
        let username = document.createElement('p2');
        let time = document.createElement('p3');
        message.textContent = body;
        username.textContent = uname;
        textBox.appendChild(username);
        textBox.appendChild(message);
        document.getElementById("chatbox").appendChild(textBox);
        window.scrollTo(0, document.body.scrollHeight);
    });
});

