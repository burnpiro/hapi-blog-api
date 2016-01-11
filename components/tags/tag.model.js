var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;

var tagSchema = new Schema({
    name          : { type: String, required: true, trim: true }
});

var tag = mongoose.model('Tag', tagSchema);

module.exports = exports = tag;