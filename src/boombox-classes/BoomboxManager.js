class BoomboxManager {
    constructor() {
        this.boomboxes = [];
    }

    addBoombox(boombox) {
        this.boomboxes.push(boombox);
    }

    removeBoombox(id) {
        this.boomboxes = this.boomboxes.filter((b) => b.id !== id);
    }

    getBoombox(id) {
        return this.boomboxes.find((b) => b.id === id);
    }
}

const boomboxManager = new BoomboxManager();

module.exports = boomboxManager;
