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

    socket.on("messageRecieved", (data) => { 
        let div = document.createElement('div');
        div.classList.add("message");
        let p = document.createElement('p');
        p.classList.add('user');
        p.innerHTML = uname + " ";
        p.innerHTML += `<span>${data["time"]}</span>`;
        div.appendChild(p);
        let body = document.createElement('p');
        body.classList.add('body');
        body.innerHTML = data["text"];
        div.appendChild(body);
        document.querySelector(".chatbox").appendChild(div);
        scrollToBottom("chatbox");
    });

    function scrollToBottom(id) {
        let div = document.querySelector("." + id);
        $("#" + id).animate(
            {
                scrollTop: div.scrollHeight - div.clientHeight,
            },
            100
        );
    }
    
});

