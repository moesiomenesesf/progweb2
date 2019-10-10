
const express = require('express');
const app = express();         
const { IncomingForm } = require('formidable');


const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const mysql = require('mysql');
const testFolder = '../Arquivos/';
const fs = require('fs');
var session = require('express-session');
var path = require('path');
const cors = require('cors');
const mime = require('mime');
const mv = require('mv');
var rimraf = require("rimraf");
app.use(cors());


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




app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname + '/web/index.html'));

});

app.get('/download', (req, res) => {

	filePath2 = req.query.folder;
    let filePath = path.join(__dirname + '/'+ `${testFolder+request.session.username+filePath2}`);

    res.download(filePath, fileName, (err) => { 

        if (err) throw err;

        console.log('File downloaded');

    });

});

app.post('/createAccount', (req, res) =>{
    var username = request.body.username;
	var password = request.body.password;
    execSQLQuery(`INSERT INTO accounts (username, password) VALUES('${username}' ,'${password}')`, res, connection);
});

app.get('/createFolder', (req,res) => {
	let filePath = req.query.folder;
	let dir = testFolder+request.session.username+filePath+'/'+req.query.folderName;
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}else{
		console.log("não da pra criar");
	}
})

app.get('/deleteFile', (req, res) => {
	let filePath = req.query.folder;
	let dir = testFolder+request.session.username+filePath;
	fs.unlink(dir, function (err) {
		if (err) throw err;
		console.log('deletou');
	  });
})

app.get('/deleteFolder', (req,res) => {
	let filePath = req.query.folder;
	let dir = testFolder+request.session.username+filePath+'/'+req.query.folderName;
	rimraf.sync(dir);
});

app.post('/upload', (req, res) => {

    let form = new IncomingForm();

    let user = req.session.username;

    let userDir = path.join(__dirname + `/Arquivos/${user}/`);

    //IMPORTANTE, tem que verificar se o diretório que tu vai salvar o arquivo existe, senão existir ele dá erro na hora de mover
    if(!fs.existsSync(userDir)){

        fs.mkdirSync(userDir);

    }

    form.parse(req, (err, fields, files) => {

        let fileName = files.filetoupload.name;
        let fileMimeType = mime.getType()

        

        let oldpath = files.filetoupload.path;
        let newpath = path.join(__dirname + `/Arquivos/${user}/` + fileName);
        
        mv(oldpath, newpath, function (err) {
            
            if (err) throw err;
            
            console.log(`File uploaded to ${newpath}`);
            let fileName = files.filetoupload.name;
            let fileMimeType = mime.getType(newpath);
            let fileSize = fs.statSync(newpath).size;

            //Metadados úteis do arquivo que podem ser salvos no BD para fácil acesso
            console.log(`File Path: ${newpath}`); //Sempre salvar esse carinha no banco para recuperar o arquivo no disco. Nunca salve o blob direto no banco, senão vc merece uma pea
            console.log(`File Name: ${fileName}`);    
            console.log(`File Type: ${fileMimeType}`);
            console.log(`File Size: ${fileSize} bytes`); //Útil para controle de utilização de armazenamento

            res.send('Arquivo subido zé!');

            
        });

    });

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

function execSQLQuery(sqlQry, res, connection){
    
    connection.query(sqlQry, function(error, results, fields){
        if(error) 
          res.json(error);
        else
          res.json(results);
        connection.end();
        console.log('executou!');
    });
  }