var Mongoose   = require('mongoose');
var Schema     = Mongoose.Schema;

var categorySchema = new Schema({
    _id           : { type: String, required: true, trim: true },
    parent        : { type: String, trim: true },
    path          : { type: String, required: true, trim: true },
    name          : { type: String, required: true, trim: true }
});

var category = Mongoose.model('category', categorySchema);

module.exports = exports = category;