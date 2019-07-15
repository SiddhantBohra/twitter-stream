var express = require('express');
var http = require('http');
let searchItem
const host = '0.0.0.0';
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var Twit = require('twit');
var favicon = require('serve-favicon');
var watchList = ['coding', '#coding'];
//listen the server
app.use(express.urlencoded())
app.listen(port, host, function () {
    console.log(`server is listening in port ${port}`)
})

app.use(favicon(__dirname + '/public/images/logo.png'))
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})
app.post('/submit-form', (req, res) => {
    watchList.length = 0
    watchList.push(req.body.term)
    watchList.push("#" + req.body.term)
    startTwitterStream(watchList).then(() => {
        res.sendFile(__dirname + '/index.html')
        console.log(watchList)

    })

})


var T = new Twit({
    consumer_key: 'SV7QoHPW0dtfjw6TCI885yf31',
    consumer_secret: 'yvBPocsnR83alEPQiSEiwzgPhF4jiQPTfjxCR2J8zKMbu0rU0Q',
    access_token: '73091059-kC7EzODlfSsGOI7LLGSaIAMi8dig3q57ZW6hpCaUg',
    access_token_secret: 'D8dGZwLFGzgLK2YN4Lm2uMlj6FcmXDCSfa3QPBi9qF9xp'
})
const startTwitterStream = (watchList) => {
    var stream = T.stream('statuses/filter', { track: watchList });
    stream.on('tweet', function (data) {
        io.sockets.emit('stream',
            data.created_at + "\n" + data.text)
    }) //data.id+"\n"+
    //socket io connection
}
io.sockets.on('connection', (socket) => {
    console.log('socket is open')
})
const stopTwitterStream = () => {
    console.log('Stopping Twitter stream.')
    twitterStream.stop()
    twitterStream = null
}
