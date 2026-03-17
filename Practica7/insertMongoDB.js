// Dependencias necesarias: npm install express mongodb
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
let client = null;

let dbName = "";
let collectionName = "";

// Referencias a la base de datos y la colección para ejecutar operaciones
let database = null;
let collection = null;

// Middlewares para procesar cuerpos de peticiones en formato JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Prepara las referencias a la base de datos y la colección.
 * Debe ejecutarse después de haber establecido la conexión con MongoDB.
 */
function prepareDB() {
  dbName = "myDatabase";
  collectionName = "recipes";

  database = client.db(dbName);
  collection = database.collection(collectionName);
  console.log(`Base de datos lista: apuntando a la colección '${collectionName}'.`);
}

/**
 * Establece la conexión con el clúster de MongoDB Atlas.
 */
async function connectDB() {
  const uri = "mongodb+srv://dimargon7_db_user:nc9YnbyJD6FSIrel@chompy.cqq0lr5.mongodb.net/?appName=Chompy";

  client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Conexión a MongoDB exitosa.");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
  }
}

/**
 * Endpoint raíz de prueba.
 * Método: GET
 */
app.get("/", async function (request, response) {
  const r = { message: "Nothing to send" };
  response.json(r);
});

/**
 * Endpoint que recibe parámetros a través de la URL (Query Params).
 * Ejemplo: /serv001?id=Nope&token=123&geo=456
 * Método: GET
 */
app.get("/serv001", async function (req, res) {
  const r = {
    user_id: req.query.id,
    token: req.query.token,
    geo: req.query.geo,
  };
  res.json(r);
});

/**
 * Endpoint idéntico a /serv001, recibe Query Params.
 * Método: GET
 */
app.get("/serv0010", async function (req, res) {
  const r1 = {
    user_id: req.query.id,
    token: req.query.token,
    geo: req.query.geo,
  };
  res.json(r1);
});

/**
 * Endpoint que recibe parámetros en el cuerpo de la petición (Body JSON).
 * Método: POST
 */
app.post("/serv002", async function (req, res) {
  const r = {
    user_id: req.body.id,
    token: req.body.token,
    geo: req.body.geo,
  };
  res.json(r);
});

/**
 * Endpoint que recibe un parámetro como parte de la ruta (Path Param).
 * Ejemplo: /serv003/1234567
 * Método: POST
 */
app.post("/serv003/:info", async function (req, res) {
  const r = { info: req.params.info };
  res.json(r);
});

/**
 * 6. MODIFICACIÓN: Endpoint para insertar recetas en MongoDB.
 * Ahora recibe el arreglo de recetas como parámetro desde el cuerpo de la petición (req.body.recipes).
 * Método: POST
 * Body esperado: { "recipes": [ { "name": "...", "ingredients": ["..."], "prepTimeInMinutes": 10 } ] }
 */
app.post("/receipt/insert", async function (req, res) {
  const recipes = req.body.recipes;

  // Validación básica para asegurar que enviaron datos correctos
  if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
    return res.status(400).json({ 
      error: "No se encontraron recetas. Asegúrate de enviar un arreglo 'recipes' en el cuerpo del JSON." 
    });
  }

  try {
    const insertManyResult = await collection.insertMany(recipes);
    console.log(`${insertManyResult.insertedCount} documents successfully inserted.\n`);
    res.json({ 
      result: `${insertManyResult.insertedCount} documents successfully inserted.`,
      insertedIds: insertManyResult.insertedIds 
    });
  } catch (err) {
    console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
    res.status(500).json({ 
      result: `Something went wrong trying to insert the new documents: ${err}` 
    });
  }
});

// Inicialización del servidor
app.listen(3000, async function () {
  console.log("Aplicación ejemplo, escuchando el puerto 3000!");
  // Esperamos a que la conexión se establezca antes de preparar la DB
  await connectDB();
  prepareDB();
});