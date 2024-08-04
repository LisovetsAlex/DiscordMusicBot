const prefix = "!";

function getClearMusicProps(message) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command !== "clear") return false;

    return true;
}

module.exports = getClearMusicProps;
