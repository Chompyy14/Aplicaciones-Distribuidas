const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

function iterateFunc(doc) {
   console.log(JSON.stringify(doc, null, 4));
}

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function findAllData(client) {
  const cursor = await client.db("sample_mflix").collection("movies").find({}).limit(2);
  // Convertir cursor a array de documentos
  const results = await cursor.toArray();
  console.log("Title: ",results[0]['title']);

  // Mostrar resultados
  console.log("Películas encontradas:");
  console.log(JSON.stringify(results, null, 2));
  
}

async function runQueries(client) {
  const db = client.db("sample_mflix");
  const movies = db.collection("movies");

  console.log("\n--- EJECUTANDO CONSULTAS ---");

  // 1. Buscar una película por su título exacto
  const movieByTitle = await movies.findOne({ title: "The Great Train Robbery" });
  console.log("1. Por Título:", movieByTitle ? movieByTitle.title : "No encontrada");

  // 2. Buscar 5 películas de un Director específico (Autor)
  const director = "Charlie Chaplin";
  const byDirector = await movies.find({ directors: director }).limit(5).toArray();
  console.log(`2. Películas de ${director}:`, byDirector.map(m => m.title));

  // 3. Películas estrenadas en un año específico (ej. 1920)
  const byYear = await movies.find({ year: 1920 }).limit(5).toArray();
  console.log("3. Películas de 1920:", byYear.map(m => m.title));

  // 4. Películas de un género específico (ej. "Comedy") con buena calificación
  const byGenre = await movies.find({ 
    genres: "Comedy", 
    "imdb.rating": { $gt: 8 } 
  }).limit(5).toArray();
  console.log("4. Comedias con rating > 8:", byGenre.map(m => m.title));

  // 5. Buscar películas donde aparezca un actor específico (Cast)
  const actor = "Buster Keaton";
  const byActor = await movies.find({ cast: actor }).limit(5).toArray();
  console.log(`5. Películas con ${actor}:`, byActor.map(m => m.title));
}

async function main() {
const uri = "mongodb+srv://dimargon7_db_user:nc9YnbyJD6FSIrel@chompy.cqq0lr5.mongodb.net/?appName=Chompy";


  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    //await listDatabases(client);
    //await findAllData(client);
    await runQueries(client);

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
