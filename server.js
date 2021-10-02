const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const fileUpload = require('express-fileupload')


const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = "138152370779-t2bqjq5llckbqfogf07dv3rd06c5chkq.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID);
const { google } = require("googleapis");
const path = require('path');


const { Readable } = require('stream');





const CLIENT_ID_GOOGLE_DRIVE = '784148226618-qg33g8spinhgbcg79h2t2bb5db497gpn.apps.googleusercontent.com';
const CLIENT_SECRET = 'DCzH9TjC97tlVjOi0QqJtykP';
const REDIRECT_URL = 'https://developers.google.com/oauthplayground/';

const REFRESH_TOKEN = '1//04slIllIF68i8CgYIARAAGAQSNwF-L9IrFPmFYE4LG-U13HQ3u9Dx0Aykvrq5ya17AJz7DV67FTHfQJjLAw6-T-y69Okv90Ad7EE';


const PORT = process.env.PORT || 5000;



app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())
app.use(
    fileUpload()
)


 
app.get('/', (req, res) => {
    res.render('index')
});

app.get('/login', (req, res) => {
    res.render("login");
})

app.get('/profile', checkAuthentication, (req, res)=>{
    let user = req.user;
    res.render('profile', {user});
})

app.get('/logout', (req, res)=>{
    res.clearCookie('session-token');
    res.redirect('/login')

})

app.post('/login', (req,res)=>{
    let token = req.body.token;
    res.cookie('session-token', token);
    res.send('success')
})

function checkAuthentication(req, res, next){
    let token = req.cookies['session-token'];
    let user = {};
    console.log(token)
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  
        });
        const payload = ticket.getPayload();
        console.log(payload)
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
      }
      verify()
      .then(()=>{
          req.user = user;
          next();
      })
      .catch(err=>{
          console.log(err)
          res.redirect('/login')
      })

}
app.post('/single', async (req, res, next) => {
    try {
        const file = req.files.mFile
        //console.log(file)
        const fileName = new Date().getTime().toString() + path.extname(file.name)

        if (file.truncated) {
            throw new Error('File size is too big...')
        }

        uploadFile(file.data,fileName);
        res.redirect('/success')


    } catch (error) {
        console.log(error)
        res.send('Error uploading file')


    }
})


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})



