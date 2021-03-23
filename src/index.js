// Imports
var Commands = require('./modules/CommandList');
var GameServer = require('./GameServer');
var AsyncConsole = require('asyncconsole');
// Init variables
var showConsole = false;
// Start message
console.log("[Game] Ogar - An open source Agar.io server implementation");

// Handle arguments
process.argv.forEach(function(val) {
    if (val == "--noconsole") {
        showConsole = false;
    } else if (val == "--help") {
        console.log("Proper Usage: node index.js");
        console.log("    --noconsole         Disables the console");
        console.log("    --help              Help menu.");
        console.log("");
    }
});

var gameServer;
startServer();
var firstStart = false;

function startServer() {

    gameServer = new GameServer();
    gameServer.start();

    // Add handles
    gameServer.shutdownHandle = function() {
        process.exit(0);
    };

    gameServer.restartHandle = function(timeout) {
        gameServer.restartScheduled = new Date();
        gameServer.restartAt = new Date(Date.now() + timeout);
        gameServer.restartId = setTimeout(function() {
                                   // gameServer.socketServer.close();
                                   // gameServer.httpServer.close();
                                   gameServer = null;
                                   if (global.gc) global.gc(); // Force garbage collection
                                   process.stdout.write("\u001b[2J\u001b[0;0H"); // Clear the console
                                   startServer();
                               }, timeout);
    };

    if (!firstStart) {
        setInterval(() => {
            firstStart = true;
            console.log("close");
            //TODO: notify will reset in 10 seconds
            gameServer.socketServer.close();
            gameServer.httpServer.close();
            setTimeout(()=>{
                console.log("restart")
                gameServer.restartHandle(100)
            },10*1000)
        }, 5*60*1000) // reset every 2 minute, 5 wave
    }

}

// Initialize the server console
if (showConsole) {
    setTimeout(function() {
    var input = new AsyncConsole('> ',function(command) {
        parseCommands(command);
    })
    },200)
}

// Console functions


function parseCommands(str) {
    // Log the string
    gameServer.log.onCommand(str);

    // Don't process ENTER
    if (str === '')
        return;

    // Splits the string
    var split = str.split(" ");

    // Process the first string value
    var first = split[0].toLowerCase();

    gameServer.pluginHandler.executeCommand(first, split);
}
