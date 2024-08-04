const prefix = "!";

function getTurnDownVolumeProps(message) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command !== "down-volume") return false;

    return true;
}

module.exports = getTurnDownVolumeProps;
