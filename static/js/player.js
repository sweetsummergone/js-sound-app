document.onreadystatechange = function () {
    let state = document.readyState;
    if (state === 'interactive') {
        document.getElementById('contents').style.visibility="hidden";
    }
    else if (state === "complete") {
        let audioArray = [{title:"Vanilla - Fuji",id:"cLrI_uyyORQ"}];

        document.getElementById('load').style.visibility="hidden";
        document.getElementById('contents').style.visibility="visible";
        document.getElementById('vinput').value = "https://www.youtube.com/watch?v="+audioArray[0].id

        const videoRgx = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const playlistRgx = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(list=))\??v?=?([^#&?]*).*/;

        const buttonNext = document.getElementById('nextMusic');
        const buttonPrev = document.getElementById('prevMusic');
        const buttonPlay = document.getElementById('play');
        const buttonPause = document.getElementById('pause');
        const buttonAdd = document.getElementById('addMusic');
        const audio = document.getElementById('player');
        const rythm = new Rythm();

        let vid = document.getElementById('vinput').value;
        let tempURL = document.getElementById('vinput').value;
        let prevAudioId = audioArray[0].id;
        let nextAudioId = audioArray[0].id;

        let tempName;
        let tempId;
        let currentTitle;

        document.querySelector('.color2').style.background = 'rgb(100, 200, 250)';
        rythm.connectExternalAudioElement(audio)

        rythm.addRythm('color2', 'color', 0, 10, {
            from: [220, 39, 106],
            to: [100, 200, 250]
        })

        rythm.addRythm('fontColor2', 'fontColor', 0, 10, {
            from: [220, 39, 106],
            to: [100, 200, 250]
        })

        audio.addEventListener('ended', () => {
            playAudio(nextAudioId)
        })

        buttonPrev.addEventListener('click', function (e) {
            playAudio(prevAudioId)
        })

        buttonNext.addEventListener('click', function (e) {
            playAudio(nextAudioId)
        })

        buttonAdd.addEventListener('click', function (e){
            vid = document.getElementById('vinput').value;
            const videoMatch = vid.match(videoRgx);
            const playlistMatch = vid.match(playlistRgx);
            vid = videoMatch && videoMatch[7].length === 11 ? videoMatch[7] : false;
            let pid = playlistMatch ? playlistMatch[6] : false;
            if(vid){
                fetchInfo(vid,true)
            } else if(pid){
                addPlaylist(pid)
            }
        })

        buttonPlay.addEventListener('click', function (e) {

            rythm.start();

            if(document.getElementById('vinput').value !== tempURL) {
                tempURL = document.getElementById('vinput').value;
                vid = tempURL;
                const videoMatch = vid.match(videoRgx);
                vid = videoMatch && videoMatch[7].length === 11 ? videoMatch[7] : false;

                if(vid){
                    playAudio(vid)
                    buttonPlay.hidden = true;
                    buttonPause.hidden = false;
                }

            } else {
                vid = tempURL;
                const videoMatch = vid.match(videoRgx);
                vid = videoMatch && videoMatch[7].length === 11 ? videoMatch[7] : false;
                if(vid){
                    fetchInfo(vid)
                    audio.play()
                    buttonPlay.hidden = true;
                    buttonPause.hidden = false;
                }
            }
        });

        buttonPause.addEventListener('click', function (e) {
           audio.pause();
           buttonPause.hidden = true;
           buttonPlay.hidden = false;
        });

        const playAudio = url => {
            audio.src = `http://localhost:3000/play/${url}`;
            let index = audioArray.findIndex(p => p.id === url)
            if(index!==-1){
                prevAudioId = index === 0 ? audioArray[audioArray.length-1].id : audioArray[index-1].id
                nextAudioId = index === audioArray.length-1 ? audioArray[0].id : audioArray[index+1].id
            }
            fetchInfo(url)
            document.getElementById("msgStatus").innerHTML = "Now playing: " + tempName;
            tempURL = `https://www.youtube.com/watch?v=${tempId}`
            audio.volume = 0.7;
            audio.play();
            rythm.start();
            buttonPlay.hidden = true;
            buttonPause.hidden = false;
        }

        const fetchInfo = (vid,add = false) => {
            fetch(`http://localhost:3000/audio/${vid}`)
                .then(response => response.text())
                .then((response) => {
                    currentTitle = response
                    tempName = response
                    tempId = vid
                    if(add) {
                        addToPlaylist({
                            title: tempName,
                            id: tempId
                        })
                        addHandlers()
                    }
                    document.getElementById("msgStatus").innerHTML = "Now playing: " + tempName;
                })
                .catch(err => console.log(err))
        }

        const addHandlers = function() {
            let videoIds = document.querySelectorAll('.el-video');
            videoIds.forEach((item,index) => {
                item.addEventListener('click', event => {
                    playAudio(item.id)
                    currentTitle = videoIds[index].innerText
                    prevAudioId = index === 0 ? videoIds[videoIds.length-1].id : videoIds[index-1].id
                    nextAudioId = index === videoIds.length-1 ? videoIds[0].id : videoIds[index+1].id
                })
            })
        }

        const addPlaylist = url => {
            const plistJSON = `http://localhost:3000/playlist/${url}`

            fetch(plistJSON)
                .then(res => res.json())
                .then((out) => {
                    let entriesJson = JSON.parse(out)["entries"];
                    for(let i = 0; i < entriesJson.length-1; i++){
                        addToPlaylist(entriesJson[i])
                        audioArray.push({
                            title: entriesJson[i]["title"],
                            id: entriesJson[i]["id"]
                        })
                    }
                    addHandlers()
                    playAudio(entriesJson[0]["id"])
                })
                .catch(err => { throw err });
        }

        const addToPlaylist = el => {
            let sl = document.getElementById("songList");
            let tag = document.createElement("div")
            tag.innerHTML = `<div class="el-video fontColor2" id="${el["id"]}" style>${el["title"]}</div>`;
            sl.appendChild(tag);
        }
    }
}


