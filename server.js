const express = require('express');
const cors = require('cors');
const {MongoClient} = require('mongodb');
const crypto = require('./ManagerCrypto.js');
const emailManager = require('./EmailManager.js');
const fs = require('fs');

const PORT = process.env.PORT || 2999;

const app = express();

const client = new MongoClient("mongodb+srv://midnight:konnor2003@webgame.rtoj0kr.mongodb.net/?retryWrites=true&w=majority");

let users;
let checkEmail;
let idInc = 0;

const FuncCheckPassword = (password) => {
    return password.length >= 8 ? true : false;
}

const FuncCheckEmail = (email) => {
    const regex = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
    return regex.test(email);
}

const ServerError = (e, res) => {
    console.log(e);
    res.status(500).json({
        "response": false,
        "message": "Ошибка на сервере"
    })
}

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

const searchEvent = (id) => {
    const arrays = [JsonFestivals, JsonFamily, JsonCitylife, JsonSports, JsonArt, JsonExhibitions];
    for (let j = 0; j < 6; ++j) {
        for (let i = 0; i < JsonFestivals.array.length; ++i) {
            if (arrays[j].array[i].ID == id) {
                return arrays[j].array[i];
            }
        }
    }
    return false;
}

const start = async () => {
    try {
        await client.connect();
        console.log("mongoDB connect");
        DataBase = await client.db().collection("checkEmail");
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







app.post('/authorization', (req, res) => {
    const func = async () => {
        const email = crypto.encrypt(req.body.email);
        const password = crypto.encrypt(req.body.password);
        let checkEmail = FuncCheckEmail(req.body.email) === true ? true : "Неверный формат почты";
        let checkPassword = FuncCheckPassword(req.body.password) === true ? true : "Неверный формат пароля";
        if (checkEmail !== true || checkPassword !== true)
        {
            res.status(200).json({
                "responseEmail": checkEmail,
                "responsePassword": checkPassword
            })
        }
        else
        {
            try
            {
                const doc = await DataBase.findOne({email: email});
                if (doc)
                {
                    if (doc.password !== password)
                    {
                        checkPassword = "Неверный пароль";
                    }
                }
                else
                {
                    checkEmail = "Аккаунт не найден";
                    checkPassword = "Аккаунт не найден";
                }
                res.status(200).json({
                    "responseEmail": checkEmail,
                    "responsePassword": checkPassword
                })
            }
            catch (e)
            {
                ServerError(e, res);
            }
        }
    }

    func();
})

app.post('/check/all', (req,res) => {
    const func = async () => {
        const email = crypto.encrypt(req.body.email);
        let checkEmail = FuncCheckEmail(req.body.email) === true ? true : "Неверный формат почты";
        let checkPassword = FuncCheckPassword(req.body.password) === true ? true : "Неверный формат пароля";
        if (checkEmail !== true || checkPassword !== true)
        {
            res.status(200).json({
                "responseEmail": checkEmail,
                "responsePassword": checkPassword
            })
        }
        else
        {
            try
            {
                const doc = await DataBase.findOne({email: email});
                if (doc)
                {
                    checkEmail = "Почта уже занята";
                }
                res.status(200).json({
                    "responseEmail": checkEmail,
                    "responsePassword": checkPassword
                })
            }
            catch (e)
            {
                ServerError(e, res);
            }
        }
    }

    func();
})

app.post('/message', (req,res) => {
    const func = async () => {
        const email = req.body.email;
        const title = req.body.title;
        const message = req.body.message;
        if (checkEmail(email))
        {
            try
            {
                emailManager.sendMail(email,title,message);
                res.status(200).json({
                    "response": true
                })
            }
            catch (e)
            {
                ServerError(e, res);
            }
        }
        else
        {
            res.status(200).json({
                "response": "Неверный формат почты"
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
            const doc = await DataBase.findOne({email: email});
            if (doc)
            {
                res.status(200).json({
                    "response": "Ошибка, аккаунт уже существует"
                })
            }
            else
            {
                await DataBase.insertOne(
                    {email: email,
                        password: password,
                        notification: false,
                        notificationEmail: false ,
                        event: []});
                res.status(200).json({
                    "response": true
                })
            }
        }
        catch (e)
        {
            ServerError(e, res);
        }
    }

    func();
})

app.post('/check/email', (req,res) => {
    const func = async () => {
        const email = crypto.encrypt(req.body.email);
        let checkEmail = FuncCheckEmail(req.body.email) === true ? true : "Неверный формат почты";
        if (checkEmail !== true)
        {
            res.status(200).json({
                "responseEmail": checkEmail
            })
        }
        else
        {
            try
            {
                const doc = await DataBase.findOne({email: email});
                if (!doc)
                {
                    checkEmail = "Аккаунт с данной почтой отсутствует";
                }
                res.status(200).json({
                    "responseEmail": checkEmail,
                })
            }
            catch (e)
            {
                ServerError(e, res);
            }
        }
    }

    func();
})

app.post('/password', (req,res) => {
    const func = async () => {
        const email = crypto.encrypt(req.body.email);
        const password = crypto.encrypt(req.body.password);
        let checkPassword = FuncCheckPassword(req.body.password) === true ? true : "Неверный формат пароля";
        if (checkPassword !== true)
        {
            res.status(200).json({
                "checkPassword": checkPassword
            })
        }
        else
        {
            try
            {
                const doc = await DataBase.findOne({email: email});
                if (!doc)
                {
                    checkPassword = "Ошибка, отсутствует аккаунт";
                }
                else
                {
                    await DataBase.updateOne({email: doc.email}, {$set: {password: password}});
                }
                res.status(200).json({
                    "checkPassword": checkPassword,
                })
            }
            catch (e)
            {
                ServerError(e, res);
            }
        }
    }

    func();
})


app.post('/event/add', (req, res) => {
    const func = async () => {
        const email = crypto.encrypt(req.body.email);
        const event = searchEvent(req.body.id);
        if (event !== false)
        {
            try
            {
                const doc = await DataBase.findOne({email: email});
                if (!doc)
                {
                    res.status(200).json({
                        "response": "Ошибка, аккаунт не найден"
                    })
                }
                else
                {
                    const array = doc.event;
                    array.push(event);
                    await DataBase.updateOne({email: email}, { $set: { event: array}});
                    res.status(200).json({
                        "response": true
                    })
                }
            }
            catch (e) {
                ServerError(e, res);
            }
        }
        else
        {
            res.status(200).json({
                "response": "Ошибка, данного мероприятия нету в базе данных"
            })
        }
    }

    func();
})

app.post( '/event/delete', (req, res) => {
    const func = async () => {
        const email = crypto.encrypt(req.body.email);
        const event = searchEvent(req.body.id).ID;
        if (event !== false)
        {
            try
            {
                const doc = await DataBase.findOne({email: email});
                if (!doc)
                {
                    res.status(200).json({
                        "response": "Ошибка, аккаунт не найден"
                    })
                }
                else
                {
                    const array = doc.event;
                    await DataBase.updateOne({email: email}, { $set: { event: array.filter(item => item.ID != event)}});
                    res.status(200).json({
                        "response": true
                    })
                }
            }
            catch (e) {
                ServerError(e, res);
            }
        }
        else
        {
            res.status(200).json({
                "response": "Ошибка, данного мероприятия нету в базе данных"
            })
        }
    }

    func();
})

app.post('/event/get', (req,res) => {
    const func = async () => {
        const email = crypto.encrypt(req.body.email);
        try
        {
            const doc = await DataBase.findOne({email: email});
            if (!doc)
            {
                res.status(200).json({
                    "response": "Ошибка, аккаунт не найден"
                })
            }
            else
            {
                const array = doc.event;
                res.status(200).json({
                    "response": true,
                    "art": array.filter(item => item.TypeEvent === "Художественные выставки"),
                    "citylife": array.filter(item => item.TypeEvent === "Столичная жизнь"),
                    "exhibitions": array.filter(item => item.TypeEvent === "Профессиональные выставки и форумы"),
                    "family": array.filter(item => item.TypeEvent === "Отдых с детьми"),
                    "festivals": array.filter(item => item.TypeEvent === "Фестивали и праздники"),
                    "sports": array.filter(item => item.TypeEvent === "Спорт"),
                })
            }
        }
        catch (e) {
            ServerError(e, res);
        }
    }

    func();
})

app.post('/event/id', (req,res) => {
    const func = async () => {
        const email = crypto.encrypt(req.body.email);
        try
        {
            const doc = await DataBase.findOne({email: email});
            if (!doc)
            {
                res.status(200).json({
                    "response": "Ошибка, аккаунт не найден"
                })
            }
            else
            {
                const array = doc.event;
                res.status(200).json({
                    "response": true,
                    "id": array.map(elem => elem.ID)
                })
            }
        }
        catch (e) {
            ServerError(e, res);
        }
    }

    func();
})


app.listen(PORT, () => {
    console.log('server start, port '+ PORT)
})