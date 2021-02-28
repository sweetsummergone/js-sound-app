document.onreadystatechange = function(){

  if(document.readyState === 'complete'){

    // Amplitude.init({
    //         "songs": [
    //             {
    //                 "name": "Dust",
    //                 "artist": "M.O.O.N",
    //                 "album": "Hotline Miami 2: Wrong Number (OST)",
    //                 "url": "../media/music.mp3",
    //                 "cover_art_url": "../media/logo.png",
    //                 "made_up_key": "I'm made up completely"
    //             },
    //             {
    //                 "name": "Resonance",
    //                 "artist": "Home",
    //                 "album": "No Description",
    //                 "url": "../media/Home – Resonance.mp3",
    //                 "cover_art_url": "../media/logo.png"
    //             }
    //         ],
    //         "playlists": {
    //           "retrowave": [0,1]
    //         },
    //         "autoplay": false
    //     });

    const rythm = new Rythm();
    rythm.addRythm('color2', 'color', 0, 10, {
        from: [255,0,50],
        to:[255,120,255]
      })
    rythm.connectExternalAudioElement(audio);
    rythm.setMusic(audio.src);
    rythm.start();
    }
  }
