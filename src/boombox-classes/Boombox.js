const play = require("play-dl");
const Song = require("./Song");
const {
    createAudioPlayer,
    getVoiceConnection,
    NoSubscriberBehavior,
    AudioPlayerStatus,
} = require("@discordjs/voice");
const { ytApiKey } = require("../../config.json");
const FetchPlaylistError = require("../errors/FetchPlaylist");
const FetchVideoInfoError = require("../errors/FetchVideoInfo");
const FetchVideoStreamError = require("../errors/FetchVideoStream");

/**
 * Boombox that is able to play YouTube videos audio in voice channels.
 */
class Boombox {
    constructor(id) {
        this.id = id;
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
            },
        });
        this.queue = [];
        this.currentSong = undefined;
        this.volume = 0.5;
        this.mutedVolume = 0;
        this.isMuted = false;
        this.state = "idle";
        this.initEvents();
    }

    /**
     * Initializes the events for the Boombox.
     */
    initEvents() {
        this.onPause(() => {});
        this.onPlay(() => {});
        this.onQueued(() => {});
        this.onSongStart(() => {});
        this.onQueueEmpty(() => {});
        this.player.on(AudioPlayerStatus.Idle, () => {
            this.playNextSong();
        });
    }

    /**
     * Subscribes to a voice channel and is ready to stream audio.
     */
    turnOn() {
        getVoiceConnection(this.id).subscribe(this.player);
    }

    /**
     * Disconnects bot from the voice channel and stops the boombox.
     */
    turnOff() {
        getVoiceConnection(this.id).destroy();
        this.player.stop();
    }

    /**
     * Returns the queue of songs.
     *
     * @return {Array} The queue of songs.
     */
    getSongs() {
        return this.queue;
    }

    /**
     * Returns an array of video URLs from a playlist.
     *
     * @param {string} playlistId - The ID of the playlist to retrieve videos from.
     * @return {Promise<Array<string>|boolean>} An array of video URLs if successful, or false if the request fails.
     */
    async getPlaylistVideos(playlistId) {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${ytApiKey}&maxResults=11`;
        const response = await fetch(url).catch(FetchPlaylistError);
        const data = await response.json();

        if (!data || !response.ok) return false;

        const videoUrls = data.items.map(
            (item) =>
                `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
        );
        return videoUrls;
    }

    /**
     * Returns data about the video.
     *
     * @param {string} url - The URL of the video.
     * @return {Promise<Object|boolean>} A Promise that resolves to the video information if successful,
     * or false if the video information could not be retrieved.
     */
    async getVideoInfo(url) {
        const info = await play.video_info(url).catch(FetchVideoInfoError);
        if (!info) return false;
        return info;
    }

    // COMMAND FUNCTIONS
    // These functions are triggered by commands.

    /**
     * USED: in commands
     *
     * Add a song to the queue.
     *
     * @param {string} url - The URL of the song to queue.
     * @return {Promise<boolean>} A Promise that resolves to true if the song was successfully queued,
     * or false if the song could not be queued.
     */
    async queueSong(url) {
        const info = await this.getVideoInfo(url);
        if (!info) return false;

        this.queue.push(new Song(info, this.volume));
        this._onQueued();
    }

    /**
     * USED: in commands
     *
     * Adds 10 random songs from a playlist to the queue.
     *
     * @param {string} playlistId - The ID of the playlist to queue.
     * @return {Promise<boolean>} A Promise that resolves to true if the playlist was successfully queued,
     * or false if the playlist could not be queued.
     */
    async queuePlaylist(playlistId) {
        const videoUrls = await this.getPlaylistVideos(playlistId);
        if (!videoUrls) return false;
        for (const url of videoUrls) {
            this.queueSong(url);
        }
        this._onQueued();
    }

    /**
     * USED: in commands
     *
     * Plays the next song in the queue.
     *
     * @return {boolean} Returns false if the queue is empty, otherwise returns nothing.
     */
    playNextSong() {
        const song = this.queue.shift();
        if (!song) {
            this._onQueueEmpty();
            return false;
        }
        this.currentSong = song;

        try {
            const resource = song.activate();
            this.player.play(resource);
            this._onSongStart();
        } catch (error) {
            FetchVideoStreamError(error);
        }
    }

    /**
     * USED: in commands
     *
     * Starts to play the current song or the next song in the queue, if none is playing.
     */
    play() {
        if (this.currentSong) {
            if (this.player.state === AudioPlayerStatus.Playing) {
                return;
            }
            this.player.unpause();
            this._onPlay();
            return;
        }
        if (!this.playNextSong()) return;
        this._onPlay();
    }

    /**
     * USED: in commands
     *
     * Pauses the current song.
     */
    pause() {
        this.player.pause();
        this._onPause();
    }

    /**
     * USED: in commands
     *
     * Clears the queue and stops the current song.
     */
    clearQueue() {
        this.queue = [];
        this._onQueueEmpty();
    }

    /**
     * USED: in commands
     *
     * Increases/decreases volume of the boombox.
     *
     * Range: 0.0 - 1.4
     * @param {number} volume - The volume to be added.
     */
    addVolume(volume) {
        if (this.isMuted) return;
        this.volume += volume;
        this.volume = Math.max(0, Math.min(this.volume, 1.4));
        if (this.currentSong) this.currentSong.setVolume(this.volume);
    }

    /**
     * USED: in commands
     *
     * Toggles Mute of the boombox.
     *
     * @param {number} volume - The volume to be added.
     */
    muteVolume() {
        if (this.mutedVolume > 0) {
            if (this.currentSong) {
                this.volume = this.mutedVolume;
                this.mutedVolume = 0;
                this.currentSong.setVolume(this.volume);
                this.isMuted = false;
            }
            return;
        }
        if (this.currentSong) {
            this.mutedVolume = this.volume;
            this.isMuted = true;
            this.currentSong.setVolume(0);
        }
    }

    // EVENT FUNCTIONS
    // These events are used in TurnOn command to update the embed of the boombox

    /**
     * Fires every time the queue is empty.
     *
     * @param {function} callback - The callback function to be executed.
     */
    onQueueEmpty(callback) {
        this._onQueueEmpty = () => {
            this.player.stop();
            this.currentSong = undefined;
            this.state = "idle";
            callback(this);
        };
    }

    /**
     * Fires every time the a new song starts.
     *
     * @param {function} callback - The callback function to be executed.
     */
    onSongStart(callback) {
        this._onSongStart = () => {
            this.state = "playing";
            callback(this);
        };
    }

    /**
     * Fires every time the song pauses.
     *
     * @param {function} callback - The callback function to be executed.
     */
    onPause(callback) {
        this._onPause = () => {
            this.state = "paused";
            callback(this);
        };
    }

    /**
     * Fires every time a song starts playing.
     *
     * @param {function} callback - The callback function to be executed.
     */
    onPlay(callback) {
        this._onPlay = () => {
            this.state = "playing";
            callback(this);
        };
    }

    /**
     * Fires every time a new song is queued.
     *
     * @param {function} callback - The callback function to be executed.
     */
    onQueued(callback) {
        this._onQueued = () => {
            callback(this);
        };
    }
}

module.exports = Boombox;
