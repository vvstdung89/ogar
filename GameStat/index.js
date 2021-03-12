// Library
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const bodyParser = require("body-parser");
const exec = require("child_process").exec;
const execSync = require("child_process").execSync;
const fs = require("fs");
const cors = require("cors");
const uuidv4 = require("uuid").v4;

/**
 * Environment vars
 */
const EXPRESS_HTTP_PORT = process.env.PORT || "3000";

/**
 * Express App init
 */
const app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//set up express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Routers
 */
const router = express.Router();
app.use("/", router);
require("./router.js")(router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

/**
 * HTTP server listening
 */
app.listen(EXPRESS_HTTP_PORT)
    .once("error", function (err) {
        if (err.code === "EADDRINUSE") {
            console.log("Cannot use this port:" + EXPRESS_HTTP_PORT + ":" + err.code);
            process.exit(-1);
        }
    })
    .once("listening", function () {
        console.log("Start listening " + EXPRESS_HTTP_PORT + " ... ");
    });

process.on("unhandledRejection", (r) => console.log(r));
