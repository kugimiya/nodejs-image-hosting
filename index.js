const express    = require('express');
const fileUpload = require('express-fileupload');
const fileType   = require('file-type');
const bodyParser = require('body-parser');
const path       = require('path');

const app              = express();
const port             = 8000;
const supportMimeTypes = ['jpg', 'jpeg', 'png', 'gif'];

app.set('templates', path.join(__dirname, 'templates'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(fileUpload(
    limits: { fileSize: 20 * 20 * 1024 },
));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', function(req, res) {
    console.log(req.files);
    if (Object.keys(req.files).length == 0)
	return res.status(400).send('No file were uploaded.');

    let file = req.files.file;
    let type = fileType(req.files.file.data);

    if (supportMimeTypes.indexOf(type) === -1)
	return res.status(400).send('Unsupported file type.');

    file.mv(req.files.file.name, function(err) {
	if (err)
	    return res.status(500).send(err);
	res.send('File uploaded!');
    });
});

app.listen(port);
