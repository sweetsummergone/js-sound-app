window.onload = function() {
    let audio = document.getElementById('player');
    let rythm = new Rythm();
    const button = document.getElementById('play');

    button.addEventListener('click', function(e) {
        let vid=document.getElementById('vinput').value

        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = vid.match(regExp);
        vid = match && match[7].length === 11 ? match[7] : false;
        audio.src = `http://localhost/play.php?id=${vid}`;
        rythm.addRythm('color2', 'color', 0, 10, {
            from:[255,100,255],
            to: [100,200,250]
        })
        rythm.connectExternalAudioElement(audio);
        rythm.setMusic(audio.src);
        rythm.start();
    });

}

