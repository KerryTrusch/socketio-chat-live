class message {
    body;
    time;
    constructor(body) {
        this.body = body;
        this.time = moment().format('h:m:s');
    }
}
