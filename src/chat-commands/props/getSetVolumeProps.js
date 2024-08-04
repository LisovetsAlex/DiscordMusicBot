const prefix = "!";

function getSetVolumeProps(message) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command !== "set-volume") return false;

    const volume = args[0];
    if (!volume) {
        return false;
    }

    return {
        volume,
    };
}

module.exports = getSetVolumeProps;
