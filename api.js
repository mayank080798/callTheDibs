const express    =   require('express');
const { dib } = require('./db');


module.exports  =   function createApi({dib}){

    const api   =   express.Router()   
    
    api.get(`/dibs`, async(req ,res) => {
        console.log('Request dibs');
        try{
            const data  =   await dib.find().sort('-createdAt');
            res.json({data});
        }catch(err){
            res.status(404).json({Error: 'The server can not find the requested resource'});
        }
    });
    
    api.post(`/dibs`, async(req,res) => {
        try{
            const { creator, title }    =   req.body;
            console.log(`POST ${creator} ${title}`); 
            if (!creator || !title) {
                return res.status(500).json({Error: 'Must include a "creator" and a "title".',});
            }

            const newDib    =   new dib({creator, title});
            const data      =   await newDib.save();
            
            res.json({data});


        }catch(err){
            console.log(err.message);
            res.status(404).json({Error: err.message});
        }
    });

    api.put(`/dibs/:dibId`, async (req, res) => {
        try{
            const { dibId } = req.params;
            const { user } = req.body;
            
            if (!user) {
                return res.status(500).json({Error: 'No "user" given to claim Dib.'});
            }
            
            const updatedDib   =   await dib.findById(dibId.toString())
            
            if(updatedDib.claimed.user){
                return res.status(500).json({Error: 'Dib has already been claimed!'});
            }

            updatedDib.claimed.user    =   user;
            updatedDib.claimed.time    =   new Date();

            const result    =   await updatedDib.save();

            res.json(result);

        }catch(err){
            console.log(`${err.message}`)
            res.status(500).json({Error: 'Cannot find Dib with given id'});
        }
    });

    return api;
}