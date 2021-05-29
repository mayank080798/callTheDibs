const { ObjectId } = require('bson');
const mongoose      =   require('mongoose');
const Schema        =   mongoose.Schema;


const dibSchema =   new Schema({
    title: {
        type        : String,
        required    : true,
    },
    creator: {
        type        : String,
        required    : true,
    },
    claimed: {
        user        : String,
        time        : Date,
    },
},{
    timestamps  :   true,
});

const Dib   =   mongoose.model('Dib', dibSchema, 'dibs');

module.exports  =   Dib;

