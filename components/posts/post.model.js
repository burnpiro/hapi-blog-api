var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;
var Category   = require('../categories/category.model');

var postSchema = new Schema({
    _category     : { type: String, required: true, trim: true, ref: 'Category' },
    name          : { type: String, required: true, trim: true },
    icon          : { type: String, required: false, trim: true },
    shortText     : { type: String, required: false, trim: true },
    content       : { type: String }
});

var post = mongoose.model('post', postSchema);

module.exports = exports = post;