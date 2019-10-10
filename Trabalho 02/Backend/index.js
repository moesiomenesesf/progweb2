
const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const mysql = require('mysql');
const testFolder = '../Arquivos/';
const fs = require('fs');
const http = require('http');
var url = require('url');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var session = require('express-session');
var path = require('path');

const connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : 'qwe123',
  database : 'progweb2'
}); 
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.get('/', function(request, response)  {
  response.sendFile(path.join( __dirname + '/../Frontend/login.html'));
});

app.get('/archives', function(request, response)  {
	response.sendFile(path.join( __dirname + '/../Frontend/index.html'));
  });

app.post('/listar', function(request, response){

})

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/archives');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/arquivos', function(request, response) {
	var folder = "";
	if (request.session.loggedin) {
		if(request.query.folder){
			folder = request.query.folder;
		}
		var arquivos=[]
		fs.readdirSync(testFolder+request.session.username+folder).forEach(file => {
		arquivos.push([file, path.extname(file)=="" ])
		});
		response.json({'User': request.session.username , 'Arquivos': arquivos})
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.get('/baixar', function(req, response){
	var folder = "";
	const file = fs.createWriteStream("file.txt");
	if(req.query.folder){
		folder = req.query.folder;
	}
	
	response.pipe(`C:/Users/e19ju/OneDrive/Desktop/Programação Web II/Trabalho 01/Frontend/index.html`);
});

app.get('/logout', function(req, res){
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  } 
});



app.listen(port);