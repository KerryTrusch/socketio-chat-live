$(function () {

    const socket = io();
    const colors = [
        "#FFFFFF",
        "#E4E4E4",
        "#888888",
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
    let uname = '';
    modalform = document.getElementById('modalform');
    modalinput = document.getElementById('userInput');
    form = document.getElementById('chatform');
    input = document.getElementById('chatbar');
    let firstconnection = true;
    let color = "";
    let numUsers;
    //Intercept default submit function for the input boxes on the chat window and username selection
    modalform.addEventListener('submit', function (e) {
        e.preventDefault();
        if (modalinput.value) {
            uname = modalinput.value;
            input.value = '';
            $('#modal').fadeOut("slow", function () { });
        }
        socket.emit("new user", uname);
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (input.value) {
            messages = new message(input.value, uname);
            socket.emit('getMessage', { "text": messages.body, "user": messages.username, "time": messages.time, "color":color });
            input.value = '';
        }
    });

    socket.on("messageRecieved", (data) => {
        addMessage(data);
        scrollToBottom("chatbox");
    });

    socket.on("user joined", (newName) => {
        addName(newName);
        scrollToBottom('userlist');
    });

    socket.on("history", (data) => {
        if (firstconnection) {
            for (let i = 0; i < data["users"].length; i++) {
                addName(data["users"][i]);
            }
            let length = Object.keys(data["messages"]).length;
            console.log(data["messages"]);
            for (let j = 0; j < length; j++) {
                addMessage(data["messages"][j]);
            }
            color = colors[data["numUsers"] % 13];
        }
        firstconnection = false;
    });

    socket.on("num users up", (numUser) => {
        numUsers = numUser;
    });

    socket.on("num users down", (numUser) => {
        numUsers = numUser;
    });

    socket.on("disconnected user", (hash) => {
        removeDivs(String(hash));
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

    function addName(username) {
        let div = document.createElement('div');
        div.classList.add("userBox");
        div.id = String(socket.id);
        let b = document.createElement('b');
        b.classList.add("name");
        b.innerHTML = username;
        div.appendChild(b);
        document.querySelector(".userlist").appendChild(div);
    }

    function addMessage(data) {
        let div = document.createElement('div');
        div.classList.add("message");
        let p = document.createElement('p');
        p.classList.add('user');
        p.style.color = data["color"];
        p.innerHTML = data["user"] + " ";
        p.innerHTML += `<span>${data["time"]}</span>`;
        div.appendChild(p);
        let body = document.createElement('p');
        body.classList.add('body');
        body.innerHTML = data["text"];
        div.appendChild(body);
        document.querySelector(".chatbox").appendChild(div);
    }

    function removeDivs(idHash) {
        document.querySelectorAll('.userlist').forEach(e => {if(e.id == idHash) e.remove() }
        );
    }
});

