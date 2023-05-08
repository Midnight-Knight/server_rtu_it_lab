const fs = require('fs');

fs.readFile('file.json', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // преобразуем содержимое файла в объект JavaScript
    const json = JSON.parse(data);

    // проходим по всем записям массива и изменяем нужный атрибут
    json.records.forEach((record) => {
        NewDate = record.Date;
        const StartDay = NewDate[0] == "0" ? Number.parseInt(NewDate[1]) : Number.parseInt((NewDate[0]+NewDate[1]));
        const StartMonth = NewDate[3] == "0" ? Number.parseInt(NewDate[4]) : Number.parseInt((NewDate[3]+NewDate[4]));
        const StartYear = Number.parseInt((NewDate[6]+NewDate[7]+NewDate[8]+NewDate[9]));
        let EndDay, EndMonth, EndYear;
        switch (NewDate.length)
        {
            case 10:
                EndDay = StartDay;
                EndMonth = StartMonth;
                EndYear = StartYear;
                break;
            default:
                EndDay = NewDate[11] == "0" ? Number.parseInt(NewDate[12]) : Number.parseInt((NewDate[11]+NewDate[12]));
                EndMonth = NewDate[14] == "0" ? Number.parseInt(NewDate[15]) : Number.parseInt((NewDate[14]+NewDate[15]));
                EndYear = Number.parseInt((NewDate[17]+NewDate[18]+NewDate[19]+NewDate[20]));
        }
        record.StartYear = StartYear;
        record.StartMonth = StartMonth;
        record.StartDay = StartDay;
        record.EndYear = EndYear;
        record.EndMonth = EndMonth;
        record.EndDay = EndDay;
    });

    // записываем изменения обратно в JSON-файл
    fs.writeFile('file.json', JSON.stringify(json), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Данные успешно изменены!');
    });
});