//initializes
const mongoose = require('mongoose');
const express = require('express');
// const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);
var cookies = require("cookie-parser");

//app
const app = express();
app.use(cookies());

//port
const port = process.env.PORT || 6400;

//routes
const productRoute = require('./routes/product');
const homeRoute = require('./routes/home');
const cartRoute = require('./routes/cart');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');

//middleware
// const corsOptions = {
// 	origin: 'http://localhost:5173', // Replace with your React app's origin
// 	credentials: true, // Enable credentials (cookies) in cross-origin requests
// };
  
// app.use(cors(corsOptions));

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-access-token");
    next();
});

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

app.disable('view cache');

app.use('/', homeRoute);
app.use('/products', productRoute);
app.use('/carts', cartRoute);
app.use('/users', userRoute);
app.use('/auth', authRoute);

app.get('/accesstoken', (req, res) => {
	return res.json({token: req.cookies['jwt-token']});
});

app.options('/', (req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(204);
});

app.get('/logout', (req, res) => {
	res.clearCookie('jwt-token');
	return res.status(200).json({msg: 'logout done'});
})

//mongoose
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose
	.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
	.then(() => {
		app.listen(port, () => {
			console.log('connect');
		});
	})
	.catch((err) => {
		console.log(err);
	});

module.exports = app;
