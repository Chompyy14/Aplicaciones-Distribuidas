// npm install express

var express = require('express');
var app = express(); //Contenedor de Endpoints o WS Restful

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async function (request, response) {

    r ={
      'message':'Nothing to send'
    };

    response.json(r);
});


// Call this service sending payload in body: raw - json
/*
{
    "id": "pt001",
    "lat": "99.1234567898765",
    "long": "-19.4567654566543"
}
*/
app.post("/echo", async function (req, res) {
  const cid = req.body.id;
  const clat = req.body.lat;
  const clong = req.body.long;

    r ={
      'id_e': cid,
      'lat_e': clat,
      'long_e': clong
    };

    res.json(r);
});

app.post("/fragmenta", async function (req, res) {
  const cid = req.body.id;
  const clat = req.body.lat;
  const clong = req.body.long;
  const clatent = Math.trunc(clat);
  const clatdec = parseFloat((clat - clatent).toFixed(13));
  const clonent = Math.trunc(clong);
  const clondec = parseFloat((clong - clonent).toFixed(13));

    r ={
      'id_e': cid,
      'lat_i_e': clatent,
      'lat_d_e': clatdec,
      'long_i_e': clonent,
      'long_d_e': clondec
    };

    res.json(r);
});

app.listen(3000, function() {
    console.log('Aplicación ejemplo, escuchando el puerto 3000!');
});
