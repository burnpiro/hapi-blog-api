var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;
var slug       = require('slug');

var tagSchema = new Schema({
    _id           : { type: String, trim: true, unique: true, lowercase: true },
    name          : { type: String, required: true, trim: true}
});

var tag = mongoose.model('Tag', tagSchema);

tagSchema.pre('save', function(next) {
    var tag = this;

    if(!tag.isModified('name')) {
        return next();
    }

    tag._id = slug(tag.name, {lower: true});
    next();

});

module.exports = exports = tag;