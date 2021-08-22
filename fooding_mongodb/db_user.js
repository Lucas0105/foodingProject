import express from 'express'
import {ObjectId} from 'mongodb'

const router = express.Router()

export default (db_client) => {
    router.use('/', (req, res, next)=>{
        console.log(`allowed cors : ${req.originalUrl}`);
        // res.set('Access-Control-Allow-Origin', 'http://localhost:8080') //8080port에 대해서 허용 함
        res.set('Access-Control-Allow-Origin', '*') //연습용
        res.set('Access-Control-Allow-Methods', '*') //method 허용 기본은 GET만
        res.set('Access-Control-Allow-Headers', '*') //Header 허용
        

        next();
    });

    router.post('/insert', async(req, res)=>{
        try{
            const database = db_client.db('foodingDb');
            const user = database.collection('user');

            console.log(req.body);

            let _res = await user.insertOne(req.body);

            res.json({r:'ok', d:_res});
        }
        catch(e){
            res.json({r:'err', err:e});
        }
    });

    router.post('/find', async(req, res) =>{
        try{
            const database = db_client.db('foodingDb');
            const user = database.collection('user');

            console.log(req.body);

            let cursor = await user.find({user:req.body.userId, passwd:req.body.passwd})
            
            let items = await cursor.toArray();

            if (items[0] === undefined){
                res.json({login:'false'});
            } 
            else {
                res.json({login:'true', userName:items[0].userName, r:'ok'});
            }

            res.json({r:'ok', d:items});
        }
        catch(e){
            res.json({r:'err', err:e});
        }
    });


    
    return router;
}