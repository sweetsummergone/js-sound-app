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
        let rythm = null;

        document.querySelector('.color2').style.background = 'rgb(100, 200, 250)';

        buttonPlay.addEventListener('click', function (e) {
            if (rythm == null)
                rythm = new Rythm()

            rythm.connectExternalAudioElement(audio)
            if(document.getElementById('vinput').value !== vid) {
                vid = document.getElementById('vinput').value;
                addPlaylist(vid)
                const videoRgx = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

                const videoMatch = vid.match(videoRgx);

                vid = videoMatch && videoMatch[7].length === 11 ? videoMatch[7] : false;

                if(vid){
                    playAudio(vid)
                }
            } else {
                rythm.addRythm('color2', 'color', 0, 10, {
                    from: [220, 39, 106],
                    to: [100, 200, 250]
                })

                audio.play();
                rythm.start();
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
                console.log(el)
                console.log(document.getElementById("songList").getElementsByTagName("a").length)

                fetch(plistJSON)
                    .then(res => res.json())
                    .then((out) => {
                        document.getElementById("msgStatus").style.visibility = "hidden";
                        let entriesJson = JSON.parse(out)["entries"];
                        let tag = document.createElement("div")
                        // tag.innerHTML = `<a href="javascript:document.getElementsByName('audio').src = \`http://localhost:3000/play/${entriesJson[0]["id"]}\`" class=\"list-group-item list-group-item-action\">${entriesJson[0]["title"]}</a>`;
                        tag.innerHTML = `<a href="#" class=\"list-group-item list-group-item-action el-video\" id="${entriesJson[0]["id"]}">${entriesJson[0]["title"]}</a>`;
                        el.appendChild(tag);
                        for(let i = 1; i < entriesJson.length; i++){
                            let tag = document.createElement("div")
                            // tag.innerHTML = `<a href="javascript:document.getElementsByName('audio').src = \`http://localhost:3000/play/${entriesJson[i]["id"]}\`" class=\"list-group-item list-group-item-action\">${entriesJson[i]["title"]}</a>`;
                            tag.innerHTML = `<a href="#" class=\"list-group-item list-group-item-action el-video\" id="${entriesJson[i]["id"]}">${entriesJson[i]["title"]}</a>`;
                            el.appendChild(tag);
                        }
                        playAudio(entriesJson[0]["id"])


                        // audio.addEventListener('ended',nextMusic, false);
                        //
                        // const nextMusic = url, => {                              // In Work
                        //
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


