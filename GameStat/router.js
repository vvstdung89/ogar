exports = module.exports = function (router) {
    router.get("/leaderboard", require("./handlers/leaderboard"));

    router.all("*", function (req, res) {
        console.log("Not found: %s %s", req.method, req.url);
        res.status("404").end();
    });
};
