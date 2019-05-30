const express = require('express');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const speakeasy = require('speakeasy');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'pug');

const secret = speakeasy.generateSecret({ length: 30 });

app.get('/', (req, res) => {
        QRCode.toDataURL(secret.otpauth_url, function (err, data_url) {
        res.render('index', {
            src: data_url,
        });
    });
});

app.post('/checkcode', (req, res) => {
    console.log('income token: ', req.body.token);
    const token = req.body.token;
    const tokenValidates = speakeasy.totp.verify({
        secret: secret.base32,
        encoding: 'base32',
        token,
    });
    console.log('token is correct: ', tokenValidates);
    if (tokenValidates) {
        res.render('approved');
    } else {
        res.render('failure');
    }
});


app.listen(8082, () => console.log('server running on port 8082'));
