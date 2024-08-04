const {
    Client,
    GatewayIntentBits,
    Events,
    EmbedBuilder,
    InteractionType,
} = require("discord.js");
const { token } = require("../config.json");
const queueMusic = require("./chat-commands/QueueMusic");
const playMusic = require("./chat-commands/PlayMusic");
const pauseMusic = require("./chat-commands/PauseMusic");
const turnOn = require("./chat-commands/TurnOn");
const turnUpVolume = require("./chat-commands/TurnUpVolume");
const turnDownVolume = require("./chat-commands/TurnDownVolume");
const skipSong = require("./chat-commands/SkipMusic");
const muteVolume = require("./chat-commands/MuteVolume");
const boomboxManager = require("./boombox-classes/BoomboxManager");
const createBoomboxEmbed = require("./utility/createBoomboxEmbed");
const deleteMessage = require("./utility/deleteMessage");
const queuePlaylist = require("./chat-commands/QueuePlaylist");
const clearMusic = require("./chat-commands/ClearMusic");
require("dotenv").config({ path: "./.dev.env" });

/**
 * Creates and returns a new Discord client, using token in the config.
 *
 * @return {Client} The logged-in Discord client.
 */
function loginDiscord() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.MessageContent,
        ],
    });

    client.once(Events.ClientReady, (readyClient) => {
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

    client.login(token);

    return client;
}

async function startBot() {
    const client = loginDiscord();

    client.on(Events.MessageCreate, async (message) => {
        if (!message.content.startsWith("!")) {
            return;
        }

        pauseMusic(message);
        playMusic(message);
        turnOn(message);
        turnUpVolume(message);
        turnDownVolume(message);
        muteVolume(message);
        queueMusic(message);
        queuePlaylist(message);
        skipSong(message);
        clearMusic(message);

        deleteMessage(message);
    });

    client.on(Events.InteractionCreate, async (interaction) => {
        if (interaction.type === InteractionType.MessageComponent) {
            const { customId, guildId } = interaction;
            let boombox;
            let embed;

            switch (customId) {
                case "pause_music":
                    pauseMusic(interaction.message, true);
                    boombox = boomboxManager.getBoombox(guildId);
                    embed = createBoomboxEmbed(boombox);

                    await interaction.update({
                        content: " ",
                        embeds: embed.embeds,
                        components: embed.components,
                    });
                    break;

                case "play_music":
                    playMusic(interaction.message, true);
                    boombox = boomboxManager.getBoombox(guildId);
                    embed = createBoomboxEmbed(boombox);

                    await interaction.update({
                        content: " ",
                        embeds: embed.embeds,
                        components: embed.components,
                    });
                    break;

                case "skip":
                    skipSong(interaction.message, true);
                    boombox = boomboxManager.getBoombox(guildId);
                    embed = createBoomboxEmbed(boombox);

                    await interaction.update({
                        content: " ",
                        embeds: embed.embeds,
                        components: embed.components,
                    });
                    break;

                case "turn_up_volume":
                    turnUpVolume(interaction.message, true);
                    boombox = boomboxManager.getBoombox(guildId);
                    embed = createBoomboxEmbed(boombox);

                    await interaction.update({
                        content: " ",
                        embeds: embed.embeds,
                        components: embed.components,
                    });
                    break;

                case "turn_down_volume":
                    turnDownVolume(interaction.message, true);
                    boombox = boomboxManager.getBoombox(guildId);
                    embed = createBoomboxEmbed(boombox);

                    await interaction.update({
                        content: " ",
                        embeds: embed.embeds,
                        components: embed.components,
                    });
                    break;

                case "clear_queue":
                    clearMusic(interaction.message, true);
                    boombox = boomboxManager.getBoombox(guildId);
                    embed = createBoomboxEmbed(boombox);

                    await interaction.update({
                        content: " ",
                        embeds: embed.embeds,
                        components: embed.components,
                    });
                    break;

                case "mute_volume":
                    muteVolume(interaction.message, true);
                    boombox = boomboxManager.getBoombox(guildId);
                    embed = createBoomboxEmbed(boombox);

                    await interaction.update({
                        content: " ",
                        embeds: embed.embeds,
                        components: embed.components,
                    });
                    break;
            }
        }
    });
}

startBot();
