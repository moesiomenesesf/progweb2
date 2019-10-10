
const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const mysql = require('mysql');

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);

app.listen(port);
console.log('API funcionando!');

router.get('/usuarios', (req, res) =>{
    execSQLQuery('SELECT * FROM usuario', res);
})

router.get('/usuarios/:id?', (req, res) =>{
    let filter = '';
    if(req.params.id) filter = ' WHERE ID=' + parseInt(req.params.id);
    execSQLQuery('SELECT * FROM usuario' + filter, res);
})

router.delete('/usuarios/:id', (req, res) =>{
    execSQLQuery('DELETE FROM usuario WHERE ID=' + parseInt(req.params.id), res);
})


router.post('/usuarios', (req, res) =>{
    const nome = req.body.nome.substring(0,150);
    const login = req.body.login.substring(0,150);
    const password = req.body.senha.substring(0,150);
    execSQLQuery(`INSERT INTO usuario (nome, login, senha) VALUES('${nome}','${login}' ,'${password}')`, res);
});

router.patch('/usuarios/:id', (req, res) =>{
    const id = parseInt(req.params.id);
    const login = req.query.login.substring(0,150);
    const nome = req.query.nome.substring(0,150);
    const senha = req.query.senha.substring(0,150);
    
    execSQLQuery(`UPDATE usuario SET nome='${nome}', login='${login}', senha='${senha}' WHERE ID=${id}`, res);
})

function execSQLQuery(sqlQry, res){
    const connection = mysql.createConnection({
      host     : 'localhost',
      port     : 3306,
      user     : 'root',
      password : 'qwe123',
      database : 'progweb2'
    });
   
    connection.query(sqlQry, function(error, results, fields){
        if(error) 
          res.json(error);
        else
          res.json(results);
        connection.end();
        console.log('executou!');
    });
  }