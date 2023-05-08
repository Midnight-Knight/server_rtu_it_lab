const express = require('express');
const cors = require('cors');
const {MongoClient} = require('mongodb');
const crypto = require('ManagerCrypto');

const PORT = process.env.PORT || 2999;

const app = express();

const client = new MongoClient("mongodb+srv://midnight:konnor2003@webgame.rtoj0kr.mongodb.net/?retryWrites=true&w=majority");

let users;

const start = async () => {
    try {
        await client.connect();
        console.log("mongoDB connect");
        users = await client.db().collection('usersTest');
    }
    catch (e) {
        console.log(e)
    }
}

start();

app.use(cors());

app.use(express.json());

app.post('/checkemail',(req,res)=> {
    const func = async () => {
        const email = crypto.encrypt(req.body.email);
        const password = crypto.encrypt(req.body.password);
        try
        {
            const doc = await users.findOne({email: email});
            if (doc)
            {
                res.status(200).json({
                    "response": false
                })
            }
            else
            {
                await users.insertOne({email: email, password: password})
                res.status(200).json({
                    "response": true
                })
            }
        }
        catch (e)
        {
            console.log(e);
            res.status(500).json({
                "response": false
            })
        }
    }

    func();
})

app.post('/registration', (req,res) => {
    const func = async () => {
        const email = crypto.encrypt(req.body.email);
        const password = crypto.encrypt(req.body.password);
        try
        {
            const doc = await users.findOne({email: email});
            if (doc)
            {
                res.status(200).json({
                    "response": false
                })
            }
            else
            {
                await users.insertOne({email: email, password: password})
                res.status(200).json({
                    "response": true
                })
            }
        }
        catch (e)
        {
            console.log(e);
            res.status(500).json({
                "response": false
            })
        }
    }

    func();
})

app.post('/authorization', (req, res) => {
    const func = async () => {
        const email = crypto.encrypt(req.body.email);
        const password = crypto.encrypt(req.body.password);
        try
        {
            const doc = await users.findOne({email: email});
            if (doc)
            {
                if (doc.password === password)
                {
                    res.status(200).json({
                        "response": true
                    })
                }
                else
                {
                    res.status(200).json({
                        "response": false
                    })
                }
            }
            else
            {
                res.status(200).json({
                    "response": false
                })
            }
        }
        catch (e)
        {
            console.log(e);
            res.status(500).json({
                "response": false
            })
        }
    }

    func();
})

app.listen(PORT, () => {
    console.log('server start, port '+ PORT)
})