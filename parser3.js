const fs = require('fs');

const path = ['my_json/festivals.json','my_json/sports.json','my_json/exhibitions.json','my_json/art.json','my_json/citylife.json','my_json/family.json'];

const parseJsonFile = (filePath) => {
    const rawData = fs.readFileSync(filePath);
    const data = JSON.parse(rawData);
    return data;
};

const LenghtData = (data) => {
    let Lenght = "";
    for(let i = 0;i < data.length; ++i)
    {
        Lenght += (" "+data[i].ID);
    }
    Lenght += " | " + data.length;
    return Lenght;
}

const main = () => {
    for (let i = 0; i < 6; ++i)
    {
        console.log(LenghtData(parseJsonFile(path[i])));
    }
}

main();