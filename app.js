const express = require('express')
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const meetingRoutes=require('./routes/meetingRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const app= express();
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

const dbURI = 'mongodb+srv://dip128:1234@cluster0.iljra.mongodb.net/node-auth?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));


app.get('*', checkUser);   

 
app.get('/',(req,res)=>{
    res.render('Home');
});  

app.get('/add', requireAuth ,(req,res)=>res.send('add'))
app.use('/meeting', meetingRoutes)
app.use(authRoutes);
app.use((req,res)=>{
    res.status(404).render('404');
})