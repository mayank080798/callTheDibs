const mongoose  =   require('mongoose');
const Dib       =   require('./models/Dib');
// const events    =   require('events');

const dbName    =   'Dib';

// const dbUri = process.env.DB_URI || 'mongodb://localhost:40000';
const dbUri     =   process.env.DB_URI || "mongodb+srv://mayank:mayank@123@cluster0.mquii.mongodb.net/Dib?retryWrites=true";

// const em = new events.EventEmitter();

const connectDB =   async ({io}) => {

    try{
        await mongoose.connect(`${dbUri}/${dbName}`, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
    
        const dibChangeStream   =   Dib.collection.watch({ fullDocument:'updateLookup' });
    
        dibChangeStream.on('change', result => {
            if(result.fullDocument._id)
            {
                io.emit('dib changeEvent',{
                    type    :   result.operationType,
                    dib     :   {
                        claimed :   {},
                        id      :   result.fullDocument._id,
                        ...result.fullDocument,
                    }
                });
            }
        });
    }catch(err){
        console.log(`${err.message}`);
    }
}

// connectDB(em);

exports.connect     = connectDB;
exports.dib         = Dib;