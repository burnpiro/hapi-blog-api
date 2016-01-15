var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;
var Category   = require('../categories/category.model');
var slug       = require('slug');

var postSchema = new Schema({
    _id           : { type: String, trim: true },
    _category     : { type: String, required: true, trim: true, ref: 'Category' },
    name          : { type: String, required: true, trim: true },
    icon          : { type: String, required: false, trim: true },
    shortText     : { type: String, required: false, trim: true },
    author        : { type: String, required: true, trim: true },
    image         : { type: String, required: false, trim: true },
    content       : { type: String, required: true },
    display       : { type: Boolean, required: true, default: true },
    createdAt     : { type: Date, default: Date.now },
    deletedAt     : { type: Date, default: null },
    tags          : [{ type: String}]
});

var post = mongoose.model('Post', postSchema);

postSchema.pre('save', function(next) {
    var post = this;

    if(!post.isModified('name')) {
        return next();
    }

    post._id = slug(post.name, {lower: true});
    next();

});

module.exports = exports = post;