import compression from 'compression';
import cors from 'cors';
import ejs from 'ejs';
import express from 'express';
import config from './config.js';


// Creating an Express application instance
const app = express();

// Setting up view engine for rendering HTML
app.set('views', 'views');
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

// Compressing all responses
app.use(compression({ threshold: 0 }));

// Enabling CORS (Cross-Origin Resource Sharing)
app.use(cors()); // Note: Disable when deploying to production


// Serving static files from the public directory
app.use(express.static(config.app.publicDir))

// Parsing JSON, multi-part (file), and url-encoded data
app.use(express.json({ limit: '50mb' })) 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// Handling default route and 404 page
app.get('/', function ( req, res) {
  res.render("pages/index/index.html");
});
app.get('*', function (req, res) {
  res.status(404).json("Page not found");
});

// Configuring and starting the server
let port = 8070; //change port number to your prefered port
app.listen(port, () => {
  console.log('Server is up and running on port: ' + port);
});