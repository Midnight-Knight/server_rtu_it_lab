const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'ActualMoscowEvents@yandex.ru',
        pass: 'qptuakvbvpkjqqsf',
    },
});


function sendMail(toEmail, subject, text) {
    const mailOptions = {
        from: 'ActualMoscowEvents@yandex.ru',
        to: toEmail,
        subject: subject,
        text: text,
    };


    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        }
    });
}

module.exports = {
    sendMail: sendMail
}