const FILE = require("path").join(__dirname, "../examples/bot_eater.txt");
const Score = require("../models/score");
const ScoreDB = new Score();
var Games = {};
var curGame = "";
Tail = require("tail").Tail;

tail = new Tail(FILE, { fromBeginning: true });

tail.on("line", function (data) {
    if (!data) return;
    let line = JSON.parse(data);
    if (!line || !line.event) {
        return;
    }
    let gameid = line.gameID;
    switch (line.event) {
        case "start":
            lastGame && console.log(Games[lastGame]);
            Games[gameid] = {
                startTime: new Date(line.time),
            };
            lastGame = gameid;
            break;
        case "eat":
            let eatObj = line.eatObject;
            let feedObj = line.feedObject;
            Games[gameid][eatObj] = Games[gameid][eatObj] || { collect: 0, loss: 0, final: 0 };
            if (line.feedIsBot) {
                Games[gameid][eatObj].collect++;
                Games[gameid][eatObj].final++;
            } else {
                Games[gameid][feedObj] = Games[gameid][feedObj] || { collect: 0, loss: 0, final: 0 };
                Games[gameid][eatObj].collect += Games[gameid][feedObj].final;
                Games[gameid][eatObj].final += Games[gameid][feedObj].final;
                Games[gameid][feedObj].loss += Games[gameid][feedObj].final;
                Games[gameid][feedObj].final = 0;
            }
    }
});

tail.on("error", function (error) {
    console.log("ERROR: ", error);
});
