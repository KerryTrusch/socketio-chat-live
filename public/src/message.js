const colors = {
    WHITE: "#FFFFFF",
    OFFWHITE: "#E4E4E4",
    GREY: "#888888",
    BLACK: "#222222",
    PINK: "#FFA7D1",
    RED: "#E50000",
    ORANGE: "#E59500",
    BROWN: "#A06A42",
    YELLOW: "#E5D900",
    LGREEN: "#94E044",
    GREEN: "#02BE01",
    LBLUE: "#00D3DD",
    BLUE: "#0000EA",
    PURPLE: "#820080"
}

class message {
    constructor(body) {
        this.body = body;
        this.time = moment().format('D/M, m:s');
    }

    sanitize(text) {
        
    }
}