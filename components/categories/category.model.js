var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;
var Post       = require('../posts/post.model');
var slug       = require('slug');

var categorySchema = new Schema({
    _id           : { type: String, trim: true },
    parent        : { type: String, trim: true },
    path          : { type: String, trim: true },
    name          : { type: String, required: true, trim: true },
    type          : { type: String, required: false, trim: true },
    icon          : { type: String, required: false, trim: true },
    posts         : [{ type: Schema.Types.ObjectId, ref: 'Post'}]
});

var category = mongoose.model('Category', categorySchema);

categorySchema.pre('save', function(next) {
    var category = this;

    if(!category.isModified('name')) {
        return next();
    }

    category._id = slug(category.name, {lower: true});
    next();

});

module.exports = exports = category;