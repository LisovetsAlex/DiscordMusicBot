const prefix = "!";

function getMuteVolumeProps(message) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command !== "mute") return false;

    return true;
}

module.exports = getMuteVolumeProps;
