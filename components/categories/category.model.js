var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;
var Post       = require('../posts/post.model')

var categorySchema = new Schema({
    _id           : { type: String, required: true, trim: true },
    parent        : { type: String, trim: true },
    path          : { type: String, required: true, trim: true },
    name          : { type: String, required: true, trim: true },
    type          : { type: String, required: true, trim: true },
    posts         : [{ type: Schema.Types.ObjectId, ref: 'Post'}]
});

var category = mongoose.model('category', categorySchema);

module.exports = exports = category;