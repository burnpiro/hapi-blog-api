var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;

var fileSchema = new Schema({
    name          : { type: String, required: true, trim: true },
    description   : { type: String, required: false, trim: true },
    path          : { type: String, required: true, trim: true },
    createdAt     : { type: Date, default: Date.now },
    type          : { type: String, enum: ['document', 'file', 'image'], required: true, trim: true, default: 'file' }
});

var file = mongoose.model('File', fileSchema);

module.exports = exports = file;