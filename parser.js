const fs = require('fs');
const readline = require('readline-sync')

const inputFilePath = 'my_json/data-114571-2023-03-24.json';
const outputFilePaths = {
    'Фестивали и праздники': 'my_json/festivals.json',
    'Спорт': 'my_json/sports.json',
    'Профессиональные выставки и форумы': 'my_json/exhibitions.json',
    'Художественные выставки': 'my_json/art.json',
    'Столичная жизнь': 'my_json/citylife.json',
    'Отдых с детьми': 'my_json/family.json',
    'Category': ['Фестивали и праздники','Спорт','Профессиональные выставки и форумы','Художественные выставки','Столичная жизнь','Отдых с детьми']
};

const parseJsonFile = (filePath) => {
    const rawData = fs.readFileSync(filePath);
    const data = JSON.parse(rawData);
    return data;
};

const writeJsonToFile = (filePath, data) => {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData);
};

function handleEvent(event)
{
    const eventType = event.TypeEvent;
    if (eventType !== 'Фестивали и праздники' && eventType !== 'Спорт' && eventType !== 'Профессиональные выставки и форумы' && eventType !== 'Художественные выставки' && eventType !== 'Столичная жизнь' && eventType !== 'Отдых с детьми') {
        console.log("if");
        console.log(`Found a seasonal event: ${event.TypeEvent}, ${event.Name}, ${event.DescriptionEvent}`);
        console.log('Choose where to save this event:');
        console.log('1. Фестивали и праздники');
        console.log('2. Спорт');
        console.log('3. Профессиональные выставки и форумы');
        console.log('4. Художественные выставки');
        console.log('5. Столичная жизнь');
        console.log('6. Отдых с детьми');
        const choice = Number.parseInt(readline.question('Enter a number from 1 to 6: '));
        if (choice >= 1 && choice <= 6) {
            const outputPath = outputFilePaths[Object.keys(outputFilePaths)[choice - 1]];
            event.TypeEvent = outputFilePaths.Category[choice-1];
            if (outputPath) {
                const events = parseJsonFile(outputPath);
                console.log(event.TypeEvent);
                console.log(event.Name);
                console.log(event.DescriptionEvent);
                console.log(event.Date);
                let NewDate = readline.question('New Date: ');
                if (NewDate != -1)
                {
                    if (NewDate == 0)
                    {
                        NewDate = event.Date;
                    }
                    const StartDay = NewDate[0] == "0" ? NewDate[1] : NewDate[0,1];
                    const StartMonth = NewDate[3] == "0" ? NewDate[4] : NewDate[3,4];
                    const StartYear = NewDate[6,7,8,9];
                    let EndDay, EndMonth, EndYear;
                    switch (NewDate.length)
                    {
                        case 10:
                            EndDay = StartDay;
                            EndMonth = StartMonth;
                            EndYear = StartYear;
                            break;
                        default:
                            EndDay = NewDate[11] == "0" ? NewDate[12] : NewDate[11,12];
                            EndMonth = NewDate[14] == "0" ? NewDate[15] : NewDate[14,15];
                            EndYear = NewDate[17,18,19,20];
                    }
                    NewEvent = {
                        ID: event.ID,
                        TypeEvent: event.TypeEvent,
                        Name: event.Name,
                        AdmArea: event.AdmArea,
                        District: event.District,
                        Address: event.Address,
                        ClarificationVenueEvent: event.ClarificationVenueEvent,
                        StartYear: Number.parseInt(StartYear),
                        StartMonth: Number.parseInt(StartMonth),
                        StartDay: Number.parseInt(StartDay),
                        EndYear: Number.parseInt(EndYear),
                        EndMonth: Number.parseInt(EndMonth),
                        EndDay: Number.parseInt(EndDay),
                        Date: NewDate,
                        ResponsibleEvent: event.ResponsibleEvent,
                        DescriptionEvent: event.DescriptionEvent,
                        coordinates: event.geoData.coordinates
                    }
                    events.push(NewEvent);
                    writeJsonToFile(outputPath, events);
                }
            }
        }
    } else {
        const outputPath = outputFilePaths[eventType];
        if (outputPath) {
            const events = parseJsonFile(outputPath);
            console.log(event.TypeEvent);
            console.log(event.Name);
            console.log(event.DescriptionEvent);
            console.log(event.Date);
            let NewDate = readline.question('New Date: ');
            if (NewDate != -1)
            {
                if (NewDate == 0)
                {
                    NewDate = event.Date;
                }
                const StartDay = NewDate[0] == "0" ? NewDate[1] : NewDate[0,1];
                const StartMonth = NewDate[3] == "0" ? NewDate[4] : NewDate[3,4];
                const StartYear = NewDate[6,7,8,9];
                let EndDay, EndMonth, EndYear;
                switch (NewDate.length)
                {
                    case 10:
                        EndDay = StartDay;
                        EndMonth = StartMonth;
                        EndYear = StartYear;
                        break;
                    default:
                        EndDay = NewDate[11] == "0" ? NewDate[12] : NewDate[11,12];
                        EndMonth = NewDate[14] == "0" ? NewDate[15] : NewDate[14,15];
                        EndYear = NewDate[17,18,19,20];
                }
                NewEvent = {
                    ID: event.ID,
                    TypeEvent: event.TypeEvent,
                    Name: event.Name,
                    AdmArea: event.AdmArea,
                    District: event.District,
                    Address: event.Address,
                    ClarificationVenueEvent: event.ClarificationVenueEvent,
                    StartYear: StartYear,
                    StartMonth: StartMonth,
                    StartDay: StartDay,
                    EndYear: EndYear,
                    EndMonth: EndMonth,
                    EndDay: EndDay,
                    Date: NewDate,
                    ResponsibleEvent: event.ResponsibleEvent,
                    DescriptionEvent: event.DescriptionEvent,
                    coordinates: event.geoData.coordinates
                }
                events.push(NewEvent);
                writeJsonToFile(outputPath, events);
            }
        }
    }
};

function main()
{
    const events = parseJsonFile(inputFilePath);
    console.log(events.length)
    for (const event of events) {
        handleEvent(event);
    }
};

main();