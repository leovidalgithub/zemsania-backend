var mongoose = require('mongoose');
var models = require('../app/models/entities')(mongoose);
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    mongoose: mongoose,
    ObjectId: ObjectId,
    models: models
};