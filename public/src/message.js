class message {
    body;
    time;
    username;
    constructor(body, username) {
        this.body = body;
        this.time = moment().format('h:mm:ss', {trim: false});
        this.username = username;
    }
}
