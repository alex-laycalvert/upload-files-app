// Middleware and such
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const fs = require('fs');

// Initializing the server
const app = express();

// Connection info
const hostname = 'ia-ubuntu';
const port = process.env.PORT || 8080;

// Where all file uploads will be stored
const uploadPath = path.join(__dirname, 'public/uploads');

// Uses static file of public
app.use(express.static(path.join(__dirname, 'public')));

// Creating view engine for handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main-layout.hbs', 
    helpers: require('./config/helpers')
}));
app.set('view engine', '.hbs');

// Enable files upload
app.use(fileUpload({
    createParentPath: true
}));

// Add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// For logging
app.use(morgan('dev'));

// Redirects default path to /hoem
app.get('/', (req, res) => {
    res.redirect('/home');
});

// Home page
// @desc    The default page of the File Upload App
app.get('/home', (req, res) => {
    res.render('home', {
        page: 'Home',
        intro: 'Welcome to the File Upload Test App!',
        desc: '<br>Here, you can upload as many files as you want, then view those files.<br>Visit the Upload Files page to upload files and the Uploaded Files page to view any uploaded files.'
    });
});

// Upload Files Page
// @desc    Where files can be uploaded to the server
app.get('/upload', (req, res) => {
    res.render('upload', {
        page: 'Upload Files',
        intro: 'Welcome to the Upload Files Page!',
        desc: 'Click Browse to look for a file to upload, then click Upload File to upload it.',
        content: ''
    });
});

// Uploaded Files Page
app.get('/uploaded', (req, res) => {
    let uploads = [];
    fs.readdir(uploadPath, (err, files) => {
        for (var i = 0; i < files.length; i++) {
            uploads[i] = files[i];
        }
    });
    res.render('uploaded', {
        page: 'Uploaded Files',
        intro: 'Welcome to the Uploaded Files Page!',
        desc: 'Here is where you can view all of the files that have been uploaded to the server.',
        path: uploadPath,
        filecontent: uploads
    });
});

// Upload File Handler
// @desc    Handles the POST request when files are uploaded
app.post('/fileupload', (req, res) => {

    // Single file upload
    // try {
    //     console.log('Attempting to upload a file...');
    //     if (!req.files) {
    //         console.log('No files were found to upload :(');
    //     } else {
    //         let upload = req.files.upload;
    //         upload.mv(path.join(uploadPath, upload.name));
    //         console.log('Upload was successful! :)');
    //         console.log('\tName: ' + upload.name);
    //         console.log('\tSize: ' + upload.size);
    //         console.log('\tType: ' + upload.type);
    //     }
    // } catch (err) {
    //     console.log(err);
    //     res.status(500).send(err);
    // }

    // Multiple File Upload
    try {
        console.log('Attempting to upload files...');
        if (!req.files) {
            console.log('No files were found to upload :(');
        } else {
            // Array of files that were uploaded
            let upload = req.files.uploads;
            
            // Checking if upload is single or multiple files
            // If the upload is multiple, upload.name does not exist
            if (upload.name) {
                upload.mv(path.join(uploadPath, upload.name));
            }

            // Loops and uploads each file in the array
            // Is skipped if upload is single file
            for (let i = 0; i < upload.length; i++) {
                upload[i].mv(path.join(uploadPath, upload[i].name));
                console.log('File has been uploaded:');
                console.log('\tName: ' + upload[i].name);
                console.log('\tSize: ' + upload[i].size);
                console.log('\tType: ' + upload[i].mimetype);
            }
            console.log('Files have been uploaded successfully! :)');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
    // Returns back to the Upload Page
    res.redirect('/upload');
});

// app.get('/fileuploadconfirm', (req, res) => {
//     res.render('confirm', {
//         message: '"Your files have been uploaded successfully! :)"'
//     });
//     res.redirect('/upload');
// });

// Starts the server
app.listen(port, () => { 
    console.log(`Server is now listening on ${port}`);
});