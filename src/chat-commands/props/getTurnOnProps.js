const prefix = "!";

function getTurnOnProps(message) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command !== "start") return false;

    return true;
}

module.exports = getTurnOnProps;
