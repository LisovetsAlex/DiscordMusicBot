const prefix = "!";

function getPlayMusicProps(message) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command !== "play") return false;

    return true;
}

module.exports = getPlayMusicProps;
