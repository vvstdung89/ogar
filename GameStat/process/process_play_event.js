const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const DBEndpoint = process.env.MONGO_DATABASE_URL;
console.log(DBEndpoint)
const FILE = path.join(__dirname, "../examples/bot_eater.txt");
const Score = require("../models/score");
const Event = require("../models/event");
const ScoreDB = new Score(DBEndpoint);
const EventDB = new Event(DBEndpoint)

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
    EventDB.updateUpsert(line, line)
    let gameid = line.gameID;
    switch (line.event) {
        case "start":
            curGame && console.log(Games[curGame]);
            Games[gameid] = {
                startTime: new Date(line.time),
            };
            curGame = gameid;
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

            let query = {
                gameid: curGame,
                uid: eatObj,
                startTime: Games[curGame].startTime,
            };
            let update = {
                updateTime: new Date,
                collectScore: Games[gameid][eatObj].collect,
                finalScore: Games[gameid][eatObj].final
            };
            ScoreDB.updateUpsert(query, update)

            if (feedObj) {
                query = {
                    gameid: curGame,
                    uid: feedObj,
                    startTime: Games[curGame].startTime,
                };
                update = {
                    updateTime: new Date,
                    collectScore: Games[gameid][feedObj].collect,
                    finalScore: Games[gameid][feedObj].final
                };
                ScoreDB.updateUpsert(query, update)
            }
    }
});

tail.on("error", function (error) {
    console.log("ERROR: ", error);
});
