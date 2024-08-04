const prefix = "!";

function getSetVolumeProps(message) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command !== "skip") return false;

    return true;
}

module.exports = getSetVolumeProps;
