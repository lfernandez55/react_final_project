let express = require('express')
let path = require('path')
import mongoose from 'mongoose'
var cookieParser = require('cookie-parser');
import { APP_TITLE } from './src/javascripts/config/vars'

// the name of the db can be changed. it will be created automatically on startup
mongoose.connect("mongodb://localhost:27017/authdb",{
  useNewUrlParser: true,
  useUnifiedTopology: true
},()=>{
  console.log("Connected")
})

//create the web server
export let app = express()

//set a global var from 
app.locals.title = app.locals.appTitle = APP_TITLE

app.use(cookieParser());

app.use('/',function(req, res, next){
    console.log(req.url);
    next();
 });

app.set('views', path.join(__dirname, 'src', 'javascripts', 'views'))

// the following is the template engine
app.set('view engine', 'ejs')

// middle ware for processing json files
app.use(express.json())

// helps encode the urls properly
app.use(express.urlencoded({extended: false}))
// set up a place for static files 7:07
app.use(express.static(path.join(__dirname, 'public')))

// authenticationx
// import passport from 'passport'
// import {strategy} from './src/javascripts/config/passport'
// passport.use(strategy)
// app.use(passport.initialize())


// Routing
import {configureRoutes} from './src/javascripts/config/routes'
configureRoutes(app)

//Create the web server
let http = require('http')
let server = http.createServer(app)
server.listen(process.env.PORT || '8080')
server.on('error', err => {
    throw err
})

server.on('listening', () => {
    let address = server.address()
    let bind = typeof address === 'string' ? address : address.port
    console.log("Listening on " + bind)
})


