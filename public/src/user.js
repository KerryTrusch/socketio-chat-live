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
    selectedFile = document.getElementById('imgform');
    let firstconnection = true;
    let color = "";
    let numUsers;
    let imgsrc = "img/default.jpg";
    //Intercept default submit function for the input boxes on the chat window and username selection
    modalform.addEventListener('submit', function (e) {
        e.preventDefault();
        if (modalinput.value && modalinput.value.length <= 20 && modalinput.value.length > 0) {
            uname = modalinput.value;
            input.value = '';
            $('#modal').fadeOut("slow", function () { });
            socket.emit("new user", { "id": socket.id, "uname": uname });
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (input.value) {
            messages = new message(input.value, uname);
            socket.emit('getMessage', { "text": messages.body, "user": messages.username, "time": messages.time, "color": color, "imgsrc": imgsrc });
            input.value = '';
        }
    });

    selectedFile.addEventListener('change', function (e) {
        const fileList = this.files[0];
    });
    socket.on("messageRecieved", (data) => {
        addMessage(data);
        scrollToBottom("chatbox");
    });

    socket.on("user joined", (data) => {
        addName(data["newName"], data["userId"]);
        scrollToBottom('userlist');
    });

    socket.on("history", (data) => {
        if (firstconnection) {
            socket.emit("get users");
            socket.on("users sent", (users) => {
                for (let key in users) {
                    addName(users[key], key)
                }
            });
            let length = Object.keys(data["messages"]).length;
            for (let j = 0; j < length; j++) {
                addMessage(data["messages"][j]);
            }
            color = colors[data["numUsers"] % 13];
        }
        firstconnection = false;
    });

    socket.on("num users up", (numUser) => {
        numUsers = numUser;
        addCurrUsers();
    });

    socket.on("num users down", (numUser) => {
        numUsers = numUser;
        addCurrUsers();
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

    function addName(username, userId) {
        let div = document.createElement('div');
        div.classList.add("userBox");
        div.id = userId;
        let b = document.createElement('b');
        b.classList.add("name");
        b.innerHTML = username;
        div.appendChild(b);
        document.querySelector(".userlist").appendChild(div);
    }

    function addMessage(data) {
        let div = document.createElement('div');
        div.classList.add("message");
        let img = document.createElement('img');
        img.src = data['imgsrc'];
        div.appendChild(img);
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

    function addCurrUsers() {
        let text = "";
        if (numUsers == 1) {
            text = "1 user currently connected";
        } else {
            text = String(numUsers) + " users currently connected";
        }
        if (document.getElementById("users")) {
            document.getElementById("users").innerHTML = text;
        } else {
            let p = document.createElement("p");
            p.classList.add('numUsers');
            p.id = "users";
            p.innerHTML = text;
            document.querySelector(".userlist").appendChild(p);
        }
    }
    
    $("#cog").click(function () {
        $(".optionsModal").fadeIn("fast", () => {})
    });

    $("#xbutton").click(function () {
        $(".optionsModal").fadeOut("fast", () => {})
    });

    $("#filelabel").hover(
        function() {
            $(".file-img-text").html("Change<br>Avatar");
          }
    );
    function removeDivs(idHash) {
        let nodes = document.querySelectorAll('.userBox');
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id == idHash) {
                nodes[i].remove();
                break;
            }
        }
    }
});

