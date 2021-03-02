const {exec,spawn} = require("child_process");
const express = require("express");
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(__dirname));
app.use(express.static('static'));
app.use(bodyParser.json());

const server = app.listen(3000, '0.0.0.0', function() {
    console.log('working on', server.address().port);
});

app.get('/play/:vid', function(req, res) {
    const url = 'https://www.youtube.com/watch?v='+req.param("vid");
    res.setHeader("Content-Type", "video/mp4");
    exec(`youtube-dl.exe -f 140 --get-url ${url}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }

        const curl = spawn('curl.exe', [stdout.trim(), '-L', '--output', '-'])
        curl.stdout.on('data', (data) => {
            res.write(data);
        });

        curl.on('close', (code) => {
            res.end();
        });

    });

    // const videoName = exec(`youtube-dl -o '%(title)s' ${url}`);
    // console.log(videoName);
});

app.get('/playlist/:plist', function(req, res) {
    const url = 'https://www.youtube.com/playlist?list='+req.param("plist");
    res.setHeader("Content-Type", "application/json");
    exec(`youtube-dl -J --flat-playlist ${url}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        res.json(stdout);
    });

});
