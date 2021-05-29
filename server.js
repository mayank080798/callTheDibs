require("dotenv").config({path:'./config.env'})
const express       =   require('express');
const cors          =   require('cors');
const http          =   require('http');
const socketIo      =   require('socket.io');
const path          =   require('path');


const db            =   require('./db');      
const createApi     =   require('./api');

const app           =   express();
const PORT          =   process.env.PORT || 8080;
const DOMAIN        =   process.env.DOMAIN || 'http://localhost';
let retryCount      =   0;


const createServer  =   async() => {
    
    app.use(cors());
    app.use(express.json());

    const httpServer = http.Server(app);
    const io = socketIo(httpServer);

    try{
        console.log(`Connecting to MongoDB`);
        await db.connect({io});
    }catch(err){
        console.error('Unable to connect to mongodb', error);
        if (++retryCount < 3) {
            console.log('Trying to connect to mongodb again in 3 seconds...');
            setTimeout(createServer, 3000);
            return;
        }
        process.exit(1);
    }

    console.log('Connected!!');

    app.get(`/Hello`,(req, res) => {
        res.json({Hello: 'world'});
    });
    
    app.use('/api', createApi({ dib : db.dib}));

    if( process.env.NODE_ENV === 'production' ){
        console.log('Production')
        app.use(express.static(path.join(__dirname, '/client/build')));
        app.use('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'client','build','index.html'))
        })
    }    

    httpServer.listen(PORT, () => {
        console.log(`Server ready at ${DOMAIN}:${PORT}/`);
    });
}

createServer();