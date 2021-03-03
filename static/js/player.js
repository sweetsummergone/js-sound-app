document.onreadystatechange = function () {
    let state = document.readyState;
    if (state === 'interactive') {
        document.getElementById('contents').style.visibility="hidden";
    }
    else if (state === "complete") {
        document.getElementById('load').style.visibility="hidden";
        document.getElementById('contents').style.visibility="visible";

        const buttonPlay = document.getElementById('play');
        const buttonPause = document.getElementById('pause');
        const audio = document.getElementById('player');

        let vid = document.getElementById('vinput').value;
        let tempURL = document.getElementById('vinput').value;
        let rythm = null;

        document.querySelector('.color2').style.background = 'rgb(100, 200, 250)';

        buttonPlay.addEventListener('click', function (e) {
            if (rythm == null){
                rythm = new Rythm()
                rythm.connectExternalAudioElement(audio)
                rythm.addRythm('color2', 'color', 0, 10, {
                    from: [220, 39, 106],
                    to: [100, 200, 250]
                })

                rythm.addRythm('fontColor2', 'color', 0, 10, {
                    from: [0,0,255],
                    to:[255,0,255]
                })
                rythm.start();
            }

            if(document.getElementById('vinput').value !== tempURL) {
                tempURL = document.getElementById('vinput').value;
                vid = tempURL;
                addPlaylist(vid)
                const videoRgx = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
                const videoMatch = vid.match(videoRgx);
                vid = videoMatch && videoMatch[7].length === 11 ? videoMatch[7] : false;
                // vid ? playAudio(vid) : audio.play();

                if(vid){
                    playAudio(vid)
                }
            } else {
                audio.play();
                // rythm.start();
            }

            buttonPlay.hidden = true;
            buttonPause.hidden = false;
        });

        buttonPause.addEventListener('click', function (e) {
           audio.pause();
           buttonPause.hidden = true;
           buttonPlay.hidden = false;
        });

        const playAudio = url => {
            audio.src = `http://localhost:3000/play/${url}`;
            audio.volume = 0.7;
            rythm.addRythm('color2', 'color', 0, 10, {
                from: [220, 39, 106],
                to: [100, 200, 250]
            })

            rythm.addRythm('fontColor2', 'color', 0, 10, {
                from: [0,0,255],
                to:[255,0,255]
            })

            audio.play();
            rythm.start();
            buttonPlay.hidden = true;
            buttonPause.hidden = false;
        }

        const addPlaylist = url => {
            const playlistRgx = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(list=))\??v?=?([^#&?]*).*/;
            const playlistMatch = url.match(playlistRgx);
            const plist = playlistMatch ? playlistMatch[6] : false;

            if(plist) {
                const plistJSON = `http://localhost:3000/playlist/${plist}`
                let el = document.getElementById("songList");

                fetch(plistJSON)
                    .then(res => res.json())
                    .then((out) => {
                        document.getElementById("msgStatus").innerHTML = "Current Playlist";
                        let entriesJson = JSON.parse(out)["entries"];
                        for(let i = 0; i < entriesJson.length-1; i++){
                            let tag = document.createElement("div")
                            tag.innerHTML = `<div class="rythm font fontColor2" style><a href="#" class=\"list-group-item list-group-item-action el-video\" id="${entriesJson[i]["id"]}">${entriesJson[i]["title"]}</a></div>`;
                            el.appendChild(tag);
                        }
                        playAudio(entriesJson[0]["id"])


                        // audio.addEventListener('ended',nextMusic, false);
                        //
                        // const nextMusic = url, => {                              // In Work
                        //
                        // }

                        // audio.onended = function(){
                        //     nextSong(url);
                        // }

                        document.querySelectorAll('.el-video').forEach(item => {
                            item.addEventListener('click', event => {
                                playAudio(item.id)
                            })
                        })
                    })
                    .catch(err => { throw err });
            }
        }

    }
}


