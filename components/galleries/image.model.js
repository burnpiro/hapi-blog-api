var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;

var imageSchema = new Schema({
    name          : { type: String, required: true, trim: true },
    description   : { type: String, required: false, trim: true },
    path          : { type: String, required: true, trim: true },
    createdAt     : { type: Date, default: Date.now }
});

var image = mongoose.model('Image', imageSchema);

module.exports = exports = image;