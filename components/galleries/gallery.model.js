var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;
var Image   = require('./image.model');

var gallerySchema = new Schema({
    name          : { type: String, required: true, trim: true },
    author        : { type: String, required: true, trim: true },
    images        : [{ type: Schema.Types.ObjectId, ref: 'Image'}],
    createdAt     : { type: Date, default: Date.now }
});

var gallery = mongoose.model('Gallery', gallerySchema);

module.exports = exports = gallery;