const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} = require("discord.js");

function createBoomboxEmbed(boombox) {
    if (!boombox) return null;

    const songs = [];
    for (let i = 0; i < boombox.getSongs().length; i++) {
        songs.push({
            name: i + 1 + ". " + boombox.getSongs()[i].name,
            value: "Duration: " + boombox.getSongs()[i].duration,
        });
    }

    const bbVolume = boombox.volume * 10;
    const volume = setCharAt("--------------", bbVolume, "0");

    const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("The Boombox")
        .setThumbnail(
            boombox.currentSong !== undefined
                ? boombox.currentSong.thumbnail
                : undefined
        )
        .addFields({
            name: " ",
            value:
                boombox.currentSong !== undefined
                    ? boombox.currentSong.name
                    : "Queue some songs and click 'Play'.",
        })
        .addFields(
            {
                name: " ",
                value: " ",
            },
            {
                name: "Duration: ",
                value: " ",
                inline: true,
            },
            {
                name:
                    boombox.currentSong !== undefined
                        ? boombox.currentSong.duration
                        : "--:--",
                value: " ",
                inline: true,
            }
        )
        .addFields(
            {
                name: " ",
                value: " ",
            },
            {
                name: "Volume: ",
                value: " ",
                inline: true,
            },
            {
                name: volume,
                value: " ",
                inline: true,
            }
        )
        .addFields(
            {
                name: " ",
                value: " ",
            },
            {
                name: "Up Next",
                value: " ",
            },
            ...songs
        );

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(
                boombox.state !== "playing" ? "play_music" : "pause_music"
            )
            .setStyle(ButtonStyle.Primary)
            .setEmoji(boombox.state !== "playing" ? "▶️" : "⏸️"),
        new ButtonBuilder()
            .setCustomId("skip")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("⏭️"),
        new ButtonBuilder()
            .setCustomId("clear_queue")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("❌")
    );

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("turn_up_volume")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🔊"),
        new ButtonBuilder()
            .setCustomId("turn_down_volume")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🔉"),
        new ButtonBuilder()
            .setCustomId("mute_volume")
            .setStyle(ButtonStyle.Primary)
            .setEmoji(boombox.isMuted ? "🔈" : "🔇")
    );

    const msg = {
        embeds: [embed],
        components: [row1, row2],
    };

    return msg;
}

function setCharAt(str, index, char) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + char + str.substring(index + 1);
}

module.exports = createBoomboxEmbed;
