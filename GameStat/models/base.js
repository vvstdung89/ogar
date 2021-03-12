var mongoose = require("mongoose");
var Schema = mongoose.Schema;

exports = module.exports = class BaseModel {
  constructor(schema, ModelName, endpoint) {
    this.modelName = ModelName;
    //create connection
    const options = {
      useNewUrlParser: true,
      autoIndex: false,
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
      reconnectInterval: 5000, // Reconnect every 500ms
      poolSize: 20, // Max number of open socket connections (pending query)
      // If not connected, return errors immediately rather than waiting for reconnect
      bufferMaxEntries: 10000,
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      useCreateIndex: true,
    };
    mongoose.set("useFindAndModify", false);
    // mongoose.set("useCreateIndex", true);
    // console.log(endpoint)
    const connection = mongoose.createConnection(endpoint, options);

    if (process.env.MONGOOSE_DEBUG === 'true') {
      mongoose.set('debug', true);
    }

    //connect model
    var SchemaModel = new Schema(schema, {
      collection: ModelName,
      versionKey: false,
    });
    this.model = connection.model(ModelName, SchemaModel);
    this.schema = SchemaModel;
  }

  //CRUD + L
  async create(query) {
    var newRecord = new this.model(query);
    return await newRecord.save();
  }

  async get(query, options) {
    return await this.model.findOne(query, options).lean();
  }

  async update(query, update) {
    return await this.model.findOneAndUpdate(query, update, {
      upsert: false,
      new: true,
    });
  }

  async updateUpsert(query, update) {
    return await this.model.findOneAndUpdate(query, update, {
      upsert: true,
      new: true,
    });
  }

  async remove(query) {
    return this.model.deleteOne(query);
  }

  async list(query, from, size, sort) {
    let fetchQuery = this.model
        .find(query || {});

    if (from) {
      fetchQuery = fetchQuery.skip(from);
    }

    if (size) {
      fetchQuery = fetchQuery.limit(size);
    }

    if (sort) {
      fetchQuery = fetchQuery.sort(sort);
    }


    return fetchQuery
        .lean()
        .exec();
  }
};
