const prefix = "!";

function getQueueMusicProps(message) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command !== "add") return false;

    const link = args[0];
    if (!link || args.length > 1) {
        return false;
    }

    return {
        link,
    };
}

module.exports = getQueueMusicProps;
