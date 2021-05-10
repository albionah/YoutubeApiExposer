// ==UserScript==
// @name Youtube API Exposer
// @description Exposes API of Youtube to control Youtube remotely
// @version 1.0.0
// @compatible firefox
// @namespace https://github.com/albionah
// @homepageURL https://github.com/albionah/YoutubeApiExposer
// @author albionah
// @match *://*.youtube.com/*
// @grant unsafeWindow
// @license GNU General Public License v3.0
// ==/UserScript==

let connection;

async function getBasicElements() {
    return new Promise((resolve) => {
        const video = document.querySelector("video");
        const player = unsafeWindow.document.getElementById("movie_player");
        if (video && player) {
            resolve({video, player});
        }
        else {
            setTimeout(() => getBasicElements().then(resolve), 1000);
        }
    });

}

getBasicElements().then(({video, player}) => {
    video.addEventListener("canplaythrough", () => {
        console.log("event canplaythrough");
        uploadBasicInfo(player);
    });
    video.addEventListener("play", () => {
        console.log("event play");
        uploadBasicInfo(player);
    });
    video.addEventListener("pause", () => {
        console.log("event pause");
        uploadBasicInfo(player);
    });
    // video.addEventListener("volumechange", () => {
    //     console.log("volumechange");
    //     uploadVolumeInfo();
    // });

    connect(video, player);
});


function getMediaInfo(player) {
    return new Promise((resolve) => {
        const title = player.getVideoData()?.title;
        const h1s = document.getElementsByTagName("h1");
        console.debug("getting media info", title, h1s[0]?.textContent);
        if (title || (h1s[0] && h1s[0].textContent.replace(/^[ \n]+/i, ''))) {
            const stats = player.getVideoStats();
            resolve({
                title: title ?? h1s[0].textContent,
                videoId: stats.docid,
                duration: stats.len,
                currentPosition: stats.lct,
                isPlaying: stats.vpa !== "1"
            });
        } else {
            setTimeout(() => getMediaInfo().then(resolve), 100);
        }
    });
}

function uploadBasicInfo(player) {
    getMediaInfo(player).then((mediaInfo) => {
        console.debug("media info", mediaInfo);
        connection?.send(JSON.stringify(mediaInfo));
    });
}

function uploadVolumeInfo(player) {
    console.log(JSON.stringify(player.getVideoStats()));
    const info = {volume: player.getVideoStats().volume};
    console.log(info);
    connection?.send(JSON.stringify(info));
}

function connect(video, player) {
    const websocket = new WebSocket("ws://localhost:7789");

    websocket.onopen = () => {
        console.debug("connected to Youtube controller");
        connection = websocket;
        uploadBasicInfo(player);
    }
    websocket.onmessage = (rawMessage) => {
        try {
            console.log(rawMessage.data);
            const message = JSON.parse(rawMessage.data);
            switch (message.type) {
                case "playOrPause":
                    var evt = new KeyboardEvent('keydown', {'keyCode': 75, 'which': 75});
                    document.dispatchEvent(evt);
                    break;

                case "play":
                    video.play();
                    break;

                case "pause":
                    video.pause();
                    break;

                case "stop":
                    video.stop();
                    break;

                case "watchPrevious":
                    player.previousVideo();
                    break;

                case "watchNext":
                    player.nextVideo();
                    break;

                case "watch":
                    console.log(message.id);
                    // player.cueVideoById(message.id);
                    // player.playVideo();
                    location.href = `?v=${message.id}`;
                    break;
            }
        } catch (error) {
            console.error(error);
        }
    }

    websocket.onclose = (event) => {
        console.info('Socket is closed. Reconnect will be attempted in 3 seconds.', event.reason);
        connection = undefined;
        setTimeout(() => connect(video, player), 3000);
    };

    websocket.onerror = (error) => {
        console.error('Socket encountered error: ', error.message, 'Closing socket');
        websocket.close();
    };
}
