var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var BaseAPI = require("./base");

// set schema
const ModelName = "event";
var schema = {
    gameid: String,
    uid: String,
    startTime: Date,
    updateTime: Date,
    collectScore: Number,
    finalScore: Number,
};

// set indexing
class DBAccessAPI extends BaseAPI {
    constructor(endpoint) {
        super(schema, ModelName, endpoint);
        // this.schema.index({ Timeslot: -1, ChainID: -1 });
        // this.model.ensureIndexes();
    }
}

exports = module.exports = DBAccessAPI;
