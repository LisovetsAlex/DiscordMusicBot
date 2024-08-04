const { createAudioResource, StreamType } = require("@discordjs/voice");
const youtubedl = require("youtube-dl-exec");
const prism = require("prism-media");

class Song {
    constructor(song, volume) {
        this.name = song.video_details.title;
        this.url = song.video_details.url;
        this.thumbnail = song.video_details.thumbnails[0].url;
        this.duration = song.video_details.durationRaw;
        this.activate = this.getResource;
        this.volume = volume;
    }

    /**
     * Creates a stream for the song, processing it with FFmpeg and setts the volume.
     *
     * Returns resource for AudioPlayer to play.
     *
     * @return {AudioResource} The audio resource for the song.
     */
    getResource() {
        const stream = youtubedl.exec(
            this.url,
            {
                o: "-",
                q: "",
                f: "bestaudio",
                r: "100K",
            },
            { stdio: ["ignore", "pipe", "ignore"] }
        );

        const audioStream = stream.stdout.pipe(
            new prism.FFmpeg({
                args: [
                    "-analyzeduration",
                    "0",
                    "-loglevel",
                    "0",
                    "-f",
                    "s16le",
                    "-ar",
                    "48000",
                    "-ac",
                    "2",
                ],
            })
        );

        const resource = createAudioResource(audioStream, {
            inputType: StreamType.Raw,
            inlineVolume: true,
        });

        this.setVolume = (volume) => {
            resource.volume.setVolume(volume);
        };

        this.setVolume(this.volume);

        return resource;
    }
}

module.exports = Song;
