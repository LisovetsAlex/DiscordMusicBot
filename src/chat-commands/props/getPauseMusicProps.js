const prefix = "!";

function getPauseMusicProps(message) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command !== "pause") return false;

    return true;
}

module.exports = getPauseMusicProps;
