const express = require('express');
const cors = require('cors');
const {MongoClient} = require('mongodb');
const crypto = require('./ManagerCrypto.js');
const EmailManager = require('./EmailManager.js');
const fs = require('fs');

const PORT = process.env.PORT || 2999;

const app = express();

const client = new MongoClient("mongodb+srv://midnight:konnor2003@webgame.rtoj0kr.mongodb.net/?retryWrites=true&w=majority");

let users;
let checkEmail;
let idInc = 0;

const parseJsonFile = (filePath) => {
    const rawData = fs.readFileSync(filePath);
    const data = JSON.parse(rawData);
    const date = new Date();
    let array = [];
    for (let i = 0; i < data.length; ++i)
    {
        const StartDate = new Date(data[i].StartYear, data[i].StartMonth-1,data[i].StartDay);
        const EndDate = new Date(data[i].EndYear, data[i].EndMonth-1,data[i].EndDay);
        idInc += 1;
        array.push({
            "ID": idInc,
            "TypeEvent": data[i].TypeEvent,
            "Name": data[i].Name,
            "AdmArea": data[i].AdmArea,
            "District": data[i].District,
            "Address": data[i].Address,
            "Location": data[i].ClarificationVenueEvent,
            "Status": date < StartDate
                ? 0
                : date >= StartDate && date <= EndDate
                    ? 1
                    : 2,
            "Date": data[i].Date,
            "ResponsibleEvent": data[i].ResponsibleEvent,
            "DescriptionEvent": data[i].DescriptionEvent,
            "coordinates": [
                data[i].coordinates[0] < data[i].coordinates[1] ? data[i].coordinates[1] : data[i].coordinates[0],
                data[i].coordinates[0] < data[i].coordinates[1] ? data[i].coordinates[0] : data[i].coordinates[1]
            ],
            "stream": date < StartDate
                ? false
                : date >= StartDate && date <= EndDate
                    ? "https://www.youtube.com/embed/jfKfPfyJRdk"
                    : "https://www.youtube.com/embed/5qap5aO4i9A"
        })
    }
    return {array};
};

const JsonFestivals = parseJsonFile('./my_json/festivals.json');
const JsonFamily = parseJsonFile('./my_json/family.json');
const JsonCitylife = parseJsonFile('./my_json/citylife.json');
const JsonSports = parseJsonFile('./my_json/sports.json');
const JsonArt = parseJsonFile('./my_json/art.json');
const JsonExhibitions = parseJsonFile('./my_json/exhibitions.json');

const start = async () => {
    try {
        await client.connect();
        console.log("mongoDB connect");
        users = await client.db().collection('usersTest');
        checkEmail = await client.db().collection("checkEmail");
    }
    catch (e) {
        console.log(e)
    }
}

start();

app.use(cors());

app.use(express.json());

app.get('/api/get/festivals', (req, res) => {
    const func = async () => {
        res.json(JsonFestivals)
    }

    func();
})

app.get('/api/get/family', (req, res) => {
    const func = async () => {
        res.json(JsonFamily)
    }

    func();
})

app.get('/api/get/citylife', (req, res) => {
    const func = async () => {
        res.json(JsonCitylife)
    }

    func();
})

app.get('/api/get/sports', (req, res) => {
    const func = async () => {
        res.json(JsonSports)
    }

    func();
})

app.get('/api/get/art', (req, res) => {
    const func = async () => {
        res.json(JsonArt)
    }

    func();
})

app.get('/api/get/exhibitions', (req, res) => {
    const func = async () => {
        res.json(JsonExhibitions)
    }

    func();
})

app.post('/checkemail',(req,res)=> {
    const func = async () => {
        const email = crypto.encrypt(req.body.email);
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