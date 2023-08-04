const{sequelize } = require('./models');
const userControllers = require('./controllers/userController.js');
const auth = require('./config/authconfig.js');
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.post('/user',userControllers.createUser );
app.get('/users',userControllers.getUsers);
app.get('/users/:uuid',userControllers.getUserwithId); 
app.put('/users/:uuid',auth.authconfig,userControllers.userUpadate);  
app.delete('/user/:uuid',auth.authconfig,userControllers.deletUser);
app.post ('/user/signin',userControllers.signin);      


app.listen(process.env.PORT,async()=>{
    console.log(`app is up on http://localhost:${process.env.PORT}`);
    await sequelize.authenticate();
    console.log("Data base connected successfully!!");
});
 
