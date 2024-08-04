const prefix = "!";

function getTurnUpVolumeProps(message) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command !== "add-volume") return false;

    return true;
}

module.exports = getTurnUpVolumeProps;
