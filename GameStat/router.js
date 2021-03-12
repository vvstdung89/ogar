exports = module.exports = function (router) {
    router.get("/bfttiming/dataSeries", require("./handlers/bfttiming").dataSeries);

    router.all("*", function (req, res) {
        console.log("Not found: %s %s", req.method, req.url);
        res.status("404").end();
    });
};
