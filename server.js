// Create a express server using cors
const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const storyRoute = require('./routes/stories');
const communityRoute = require('./routes/community');
const commentsRoute = require('./routes/comments');
const connectDB = require('./db');
const fileUpload = require('express-fileupload');


connectDB();
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('build', {
    extensions: ['html', 'htm'],
}));

app.get('/platform', (req, res) => {
    res.sendFile(__dirname + '/build/index.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/build/Home.html');
})
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/build/login.html');
})
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/build/signup.html');
})
app.use(fileUpload({
    useTempFiles: true
}));

app.use('/auth', authRoute);
app.use('/posts', postRoute);
app.use('/stories', storyRoute);
app.use('/groups', communityRoute);
app.use('/comments', commentsRoute);




app.listen(port, () => { console.log(`Website is live at ${port}!`) });