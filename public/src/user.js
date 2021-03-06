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
    let modalform = document.getElementById('modalform');
    let modalinput = document.getElementById('userInput');
    let form = document.getElementById('chatform');
    let input = document.getElementById('chatbar');
    let serverinput = document.getElementById('server_input');
    let firstconnection = true;
    let color = "";
    let numUsers = 0;
    let imgsrc = "img/default.jpg";
    let sliderVals = { 1: 0.75, 2: 1, 3: 1.5 };
    let slider = document.getElementById('slider');
    let room = "";
    //First we built the servers list before showing the user the login screen and chat window
    socket.emit("get servers");
    socket.on("servers", (data) => {
        if (!room) {
            for (let i = 0; i < data.length; i++) {
                if (data[i] != 'users' && data[i] != 'global_room') {
                    this.$OuterDiv = $('<div></div>').addClass('server_list');
                    this.$InnerDiv = $('<span></span>').addClass('server_list_text').html(data[i]);
                    this.$OuterDiv.append(this.$InnerDiv);
                    this.$OuterDiv.click(function () {
                        document.getElementById("chat_content").style.display = 'initial';
                        document.getElementById("server_browser").style.display = 'none';
                        room = $(this).find("span").html();
                        socket.emit("join room", room);
                    })
                    $('.server_holder').append(this.$OuterDiv);
                }
            }
        }
    });

    // Allow server creation if you hit enter on the input form or click the button
    serverinput.addEventListener('submit', function(e) {
        e.preventDefault();
        if (serverinput.value.length > 0 && serverinput.value.length <= 20) {
            room = document.getElementById('server_input').value;
            document.getElementById("chat_content").style.display = 'initial';
            document.getElementById("server_browser").style.display = 'none';
            socket.emit("join room", room);
            defaultmessage();
        }
    });

    $('#server_button').click(function() {
        if (serverinput.value.length > 0 && serverinput.value.length <= 20) {
            room = document.getElementById('server_input').value;
            document.getElementById("chat_content").style.display = 'initial';
            document.getElementById("server_browser").style.display = 'none';
            defaultmessage();
        }
    });

    function defaultmessage() {
        messages = new message("Welcome to your new server! Hit the cog in the top right for additional options", "Server");
        socket.emit('getMessage', { "text": messages.body, "user": messages.username, "time": messages.time, "color": "#FFFFFF", "imgsrc": imgsrc, "room": room });
    }
    //Intercept default submit function for the input boxes on the chat window and username selection
    modalform.addEventListener('submit', function (e) {
        e.preventDefault();
        if (modalinput.value && modalinput.value.length <= 20 && modalinput.value.length > 0) {
            uname = modalinput.value;
            input.value = '';
            $('#modal').fadeOut("slow", function () { });
            socket.emit("new user", { "id": socket.id, "uname": uname, "room": room });
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (input.value) {
            messages = new message(input.value, uname);
            socket.emit('getMessage', { "text": messages.body, "user": messages.username, "time": messages.time, "color": color, "imgsrc": imgsrc, "room": room });
            input.value = '';
        }
    });

    $("#fileupload").on('change', function () {
        let reader = new FileReader();
        reader.onload = function (e) {
            let thisImage = reader.result;
            imgsrc = thisImage;
            $("#pfppreview").attr("src", thisImage);
        }
        reader.readAsDataURL(this.files[0]);
    });

    $('#slider').change(function () {
        changeSize($(this).val());
    });

    socket.on("messageRecieved", (data) => {
        addMessage(data);
        scrollToBottom("chatbox");
        changeSize(slider.value);
    });

    socket.on("user joined", (data) => {
        addName(data["newName"], data["userId"]);
        numUsers++;
        addCurrUsers();
        scrollToBottom('userlist');
    });

    // Only retrieves divs on first connect
    socket.on("history", (data) => {
        if (firstconnection) {
            for (let i = 0; i < data["numUsers"]; i++) {
                addName(data["users"][i].name, data["users"][i].id);
            }
            numUsers = data["numUsers"];
            addCurrUsers();
            let length = data["messages"].length;
            for (let j = 0; j < length; j++) {
                addMessage(data["messages"][j]);
            }
            color = colors[data["numUsers"] % 13];
        }
        firstconnection = false;
    });

    socket.on("disconnected user", (hash) => {
        removeDivs(String(hash));
        numUsers--;
        addCurrUsers();
    });


    // Helper functions for adding divs to document
    function addName(username, userId) {
        let div = document.createElement('div');
        div.classList.add("userBox");
        div.id = userId;
        let b = document.createElement('b');
        b.classList.add("name");
        b.innerHTML = username;
        div.appendChild(b);
        document.querySelector(".nameholder").appendChild(div);
    }

    function addMessage(data) {
        let div = document.createElement('div');
        div.classList.add("message");

        let imgdiv = document.createElement('div');
        let img = document.createElement('img');
        img.classList.add("text-pfp");
        img.src = data['imgsrc'];
        imgdiv.appendChild(img);
        div.appendChild(imgdiv);

        let messagebody = document.createElement('div');
        messagebody.classList.add("messagebody");
        let p = document.createElement('p');
        p.classList.add('user');
        p.style.color = data["color"];
        p.innerHTML = data["user"] + " ";
        p.innerHTML += `<span>${data["time"]}</span>`;
        messagebody.appendChild(p);
        let body = document.createElement('p');
        body.classList.add('body');
        body.innerHTML = data["text"];
        messagebody.appendChild(body);

        div.appendChild(messagebody);
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

    function scrollToBottom(id) {
        let div = document.querySelector("." + id);
        $("#" + id).animate(
            {
                scrollTop: div.scrollHeight - div.clientHeight,
            },
            100
        );
    }


    // Jquery for options modal
    $("#cog").click(function () {
        $(".optionsModal").fadeIn("fast", () => { })
    });

    $("#xbutton").click(function () {
        $(".optionsModal").fadeOut("fast", () => { })
    });

    $('body').click(function (event) {
        if (!event.target.closest('.optionsModal') && !event.target.closest('#cog')) {
            $(".optionsModal").fadeOut("fast", () => { })
        }
    });

    $("#filelabel").hover(
        function () {
            $(".file-img-text").html("Change<br>Avatar");
        }
    );

    function changeSize(size) {
        $('.message').css('font-size', sliderVals[size][0] + "px");
        $('.text-pfp').css('width', sliderVals[size][1] + "rem");
    }

    // This removes the user on the left hand side by identifying their div using the unique socket.io id given to them 
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

