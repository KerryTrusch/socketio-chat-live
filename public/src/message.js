class message {
    body;
    time;
    username;
    constructor(body, username) {
        this.body = body;
        this.time = moment().format('h:m:s');
        this.username = username;
    }
}
