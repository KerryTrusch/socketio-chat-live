class message {
    constructor(body) {
        this.body = body;
        this.time = moment().format('D/M, m:s');
    }
}
