const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();


const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = "138152370779-t2bqjq5llckbqfogf07dv3rd06c5chkq.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID);



const { Readable } = require('stream');







const PORT = process.env.PORT || 5000;



app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())



 
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

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})

