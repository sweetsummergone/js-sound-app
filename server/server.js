const express = require('express')
const {exec,spawn} = require('child_process')
const cors = require('cors')
const app = express()
const port = 8000

app.use(cors())

app.listen(port, () => {
    console.log(`Sound app listening at http://localhost:${port}`)
})

app.get('/play/:vid', function(req, res) {
    const url = 'https://www.youtube.com/watch?v='+req.param("vid");
    res.writeHead(200, {
        'Content-Type': 'video/mp4'
    });
    exec(`youtube-dl.exe -f 140 --get-url ${url}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }

        const curl = spawn('curl.exe', [stdout.trim(), '-L', '--output', '-']);

        curl.stdout.on('data', (data) => {
            res.write(data);
            if(!stdout) res.end();
        });
    });
    // res.send("tagId is set to " + req.param("vid"));
});
