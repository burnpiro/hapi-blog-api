var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;
var Category   = require('../categories/category.model');

var postSchema = new Schema({
    _category     : { type: String, required: true, trim: true, ref: 'Category' },
    name          : { type: String, required: true, trim: true },
    icon          : { type: String, required: false, trim: true },
    shortText     : { type: String, required: false, trim: true },
    author        : { type: String, required: true, trim: true },
    image         : { type: String, required: true, trim: true },
    content       : { type: String, required: true },
    display       : { type: Boolean, required: true, default: true },
    createdAt     : { type: Date, default: Date.now }
});

var post = mongoose.model('Post', postSchema);

module.exports = exports = post;