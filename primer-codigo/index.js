var express = require('express');
const res = require('express/lib/response');
var app = express(); //Contenedor de Endpoints o WS Restful

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async function (request, response) {

  r ={
    'message':'Nothing to send'
  };

  response.json(r);
});

app.get("/aleatorio", async function (req, res) {

    const num = Math.floor(Math.random()*100)+1;

    res.send (`El número aleatorio es: ${num}`)
    res.json(num)
});

app.listen(3000, function() {
    console.log('Aplicación ejemplo, escuchando el puerto 3000!');
});
