var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;
var Post       = require('../posts/post.model')

var categorySchema = new Schema({
    _id           : { type: String, required: true, trim: true },
    parent        : { type: String, trim: true },
    path          : { type: String, trim: true },
    name          : { type: String, required: true, trim: true },
    type          : { type: String, required: false, trim: true },
    icon          : { type: String, required: false, trim: true },
    posts         : [{ type: Schema.Types.ObjectId, ref: 'Post'}]
});

var category = mongoose.model('Category', categorySchema);

module.exports = exports = category;