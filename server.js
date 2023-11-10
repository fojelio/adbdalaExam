const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql');
const app = express();
const fs = require('fs');

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "",
   database: "tp46"
});

db.connect(function (err) {
   if (err) throw err;
   console.log("Conectado a la base de datos!");

   app.post('/datos', (req, res) => {
      const { nombre, edad, estatura, nacionalidad, pos, peso } = req.body;



      const sql = `INSERT INTO jugadores (nombre, edad, estatura, nacionalidad, pos, peso) VALUES (?, ?, ?, ?, ?, ?)`;
      db.query(sql, [nombre, edad, estatura, nacionalidad, pos, peso], (err, result) => {
         if (err) {
            console.error("Error al insertar en la base de datos:", err);
            res.status(500).json({ error: 'Error interno del servidor' });
         } else {
            console.log("Datos insertados en la base de datos:", result);
            res.json({ success: true });
         }
      });
   });


   app.get('/jugadores-argentinos', (req, res) => {
      const sql = `SELECT * FROM jugadores WHERE nacionalidad = 'argentino'`;
      db.query(sql, (err, result) => {
         if (err) {
            console.error("Error al obtener jugadores argentinos:", err);
            res.status(500).json({ error: 'Error interno del servidor' });
         } else {
            res.json(result);
         }
      });
   });

   app.get('/peso', (req, res) => {
      const sql = `SELECT * FROM jugadores WHERE peso > 75 and peso < 80`;
      db.query(sql, (err, result) => {
         if (err) {
            console.error("Error al obtener peso:", err);
            res.status(500).json({ error: 'Error interno del servidor' });
         } else {
            res.json(result);
         }
      });
   });

   app.get('/altura', (req, res) => {
      const sql = `SELECT * FROM jugadores ORDER BY estatura DESC LIMIT 1;`;
      db.query(sql, (err, result) => {
         if (err) {
            console.error("Error al obtener jugador mas alto:", err);
            res.status(500).json({ error: 'Error interno del servidor' });
         } else {
            res.json(result);
         }
      });
   });

   app.get('/todos', (req, res) => {
      const sql = `SELECT * FROM jugadores;`;
      db.query(sql, (err, result) => {
         if (err) {
            console.error("Error al obtener jugadores:", err);
            res.status(500).json({ error: 'Error interno del servidor' });
         } else {
            res.json(result);
         }
      });
   });

   app.delete('/borrar', (req, res) => {
      const { posicion } = req.body;
      const sql = `DELETE FROM jugadores WHERE pos = ?`;
      db.query(sql, [posicion], (err, result) => {
         if (err) {
            console.error(`Error al borrar jugadores en la posición ${posicion}:`, err);
            res.status(500).json({ error: 'Error interno del servidor' });
         } else {
            res.json({ success: true });
         }
      });
   });

   app.get('/jugador:nombre', (req, res) => {
      const { nombre } = req.params;
      const sql = `SELECT * FROM jugadores WHERE nombre = ?`;
      db.query(sql, [nombre], (err, result) => {
         if (err) {
            console.error(`Error al obtener jugador por nombre ${nombre}:`, err);
            res.status(500).json({ error: 'Error interno del servidor' });
         } else {
            res.json(result);
         }
      });
   });

   app.put('/modificar:nombre', (req, res) => {
      const { nombre } = req.params;
      const { nuevoNombre, nuevaEdad, nuevaEstatura, nuevaNacionalidad, nuevaPosicion, nuevoPeso } = req.body;

      console.log("Datos a actualizar:", { nuevoNombre, nuevaEdad, nuevaEstatura, nuevaNacionalidad, nuevaPosicion, nuevoPeso });

      const sql = `UPDATE jugadores SET nombre = ?, edad = ?, estatura = ?, nacionalidad = ?, pos = ?, peso = ? WHERE nombre = ?`;

      db.query(sql, [nuevoNombre, nuevaEdad, nuevaEstatura, nuevaNacionalidad, nuevaPosicion, nuevoPeso, nombre], (err, result) => {

         if (err) {
            console.error(`Error al modificar jugador ${nombre}:`, err);
            res.status(500).json({ error: 'Error interno del servidor' });
         } else {
            res.json({ success: true });
         }
      });
   });

   app.get('/', (req, res) => {
      fs.readFile('index.html', 'utf8', (err, data) => {
         if (err) {
            console.error(err);
            res.status(500).send('Error interno del servidor');
         } else {
            res.send(data);
         }
      });
   });
});


app.listen(app.get('port'), () => {
   console.log('servidor conectado!');
});

