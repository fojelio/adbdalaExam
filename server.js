const http = require('http');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

function traducirPalabra(palabra) {
    let vocales = 'aeiou';
let p;
    for(let i=0;i < palabra.length;i++){
      if(palabra.charAt(i) != vocales.charAt(0) && palabra.charAt(i) != vocales.charAt(1) && palabra.charAt(i) != vocales.charAt(2) && palabra.charAt(i) != vocales.charAt(3) && palabra.charAt(i) != vocales.charAt(4))
      { p = p + palabra.charAt(i);
        }
        else{
        p= p +palabra.charAt(i) + "p" + palabra.charAt(i);
      }
    }
  return p;
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    const filePath = path.join(__dirname, 'index.html');

    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error interno del servidor');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (req.method === 'POST' && req.url === '/traducir') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const palabra = body.trim();
      const palabraTraducida = traducirPalabra(palabra);

      const respuestaHTML = `
          Palabra Traducida:
          ${palabraTraducida}
      `;

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(respuestaHTML);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Error 404: Ruta no encontrada');
  }
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Servidor Node.js en ejecución en el puerto ${port}`);
});