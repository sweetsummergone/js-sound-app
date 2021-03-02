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

                const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
                const match = vid.match(regExp);
                vid = match && match[7].length === 11 ? match[7] : false;

                audio.src = `http://localhost:3000/play/${vid}`;
                audio.volume = 0.7;
            }


            rythm.addRythm('color2', 'color', 0, 10, {
                from: [220, 39, 106],
                to: [100, 200, 250]
            })

            audio.play();
            rythm.start();
            buttonPlay.hidden = true;
            buttonPause.hidden = false;
        });

        buttonPause.addEventListener('click', function (e) {
           audio.pause();
           buttonPause.hidden = true;
           buttonPlay.hidden = false;
        });
    }
}

