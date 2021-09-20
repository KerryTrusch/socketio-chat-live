class message {
    body;
    time;
    constructor(body, username) {
        this.body = body;
        this.time = moment().format('h:m:s');
        this.username = username;
    }
}
