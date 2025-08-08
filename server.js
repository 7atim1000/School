require('dotenv').config()

const express = require ('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

const schoolRouter = require('./routers/school.router')
const classRouter = require('./routers/class.router')

// to register Authorizationa in browser console
const corsOption = {exposedHeaders: "Authorization"}
app.use(cors(corsOption))

//app.use(cors());
app.use(cookieParser())

app.get('/test', (req, res) =>{
   res.send({ id: 1, message:'welcome, it is working'})
})


// Routes 
app.use('/api/school', schoolRouter)
app.use('/api/class', classRouter)


// DB   MONGO_URL=mongodb+srv://7atim1000:1jCc7WYQ8uEXuKvf@cluster0.r2oymje.mongodb.net/
//mongoose.connect(`mongodb://localhost/School`).then(db=>{
mongoose.connect(`mongodb+srv://7atim1000:1jCc7WYQ8uEXuKvf@cluster0.r2oymje.mongodb.net/School`).then(db=>{
   console.log('DB is connected successfully') 
}).catch(e=>{
    console.log('Connection error', e)
})


// PORT 
const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log('server is running at PORT', PORT)
})



