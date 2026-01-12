
/* Hämtar express ramverket */
const express = require('express');
/* Hämtar sqlite3 ramverket, verbose ger mer detaljerade felmeddelanden */
const sqlite3 = require('sqlite3').verbose();

/* Skapar serverobjektet */
const server = express();

server
  /* Gör att servern använder JSON */
  .use(express.json())
  /* Gör att servern kan tolka data som skickas i HTML-formulär */
  .use(express.urlencoded({ extended: false }))
  /* Gör att servern kan kommunicera med webbsidan */
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  });

/* Startar servern på port 3000 */
server.listen(3000, () => console.log('Servern körs'));

/* Skapar och ansluter till databasen */
const db = new sqlite3.Database('./books.db');
/* Skapar tabellen om det inte redan existerar */
db.run('CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, genre TEXT, isbn INTEGER, release DATE)');

/* GET-förfrågan mot endpointen /books */
server.get('/books', (req, res) => {
  /* Hämtar alla rader från tabellen */
  db.all('SELECT * FROM books', (err, rows) => {
    /* Om fel */
    if (err) {
      /* Skickar status '500' och felmeddelandet */
      res.status(500).json({error: err.message});
    }
    else {
      /* Skickar tillbaka listan med böcker i JSON-format */
      res.json(rows);
    }
  });
});

/* PUT-förfrågan mot endpointen /books */
server.put('/books', (req, res) => {
  /* Datan från förfrågan */
  const book = req.body

  /* Uppdaterar specifik bok baserat på datan från förfrågan */
  db.run(`UPDATE books SET title = ?, author = ?, genre = ?, isbn = ?, release = ? WHERE id = ?`, 
    [book.title, book.author, book.genre, book.isbn, book.release, book.id], (err) => {
      /* Om fel */
      if (err) {
        /* Skickar status '500' och felmeddelandet */
        res.status(500).json({error: err.message});
      }
      else {
        /* Svarar att boken uppdaterades */
        res.json({ message: 'Boken är uppdaterad!'});
      }
    }
  );
});

/* POST-förfrågan mot endpointen /books */
server.post('/books', (req, res) => {
  /* Datan från förfrågan */
  const book = req.body;

  /* Lägger till boken baserat på datan från förfrågan */
  db.run('INSERT INTO books (title, author, genre, isbn, release) VALUES (?, ?, ?, ?, ?)', 
    [book.title, book.author, book.genre, book.isbn, book.release], (err) => {
      /* Om fel */
      if (err) {
        /* Skickar status '500' och felmeddelandet */
        res.status(500).json({error: err.message});
      }
      else {
        /* Svarar att boken är tillagd */
        res.json({ message: 'Boken är tillagd!'}); 
      }
    }
  );
});

/* DELETE-förfrågan mot enpointen /books/:id */
server.delete('/books/:id', (req, res) => {
  /* Hämtar id:et från URL:en i förfrågan */
  const id = req.params.id;
  /* Tar bort boken med det specifika id:et */
  db.run('DELETE FROM books WHERE id = ?', [id], (err) => {
    /* Om fel */
    if (err) {
      /* Skickar status '500' och felmeddelandet */
      res.status(500).json({error: err.message});
    }
    else {
      /* Svarar att boken är borttagen */
      res.json({message: 'Boken togs bort från listan'});
    }
  });
});

/* GET-förfrågan mot endpointen /books/:id */
server.get('/books/:id', (req, res) => {
  /* Hämtar id:et från URL:en i förfrågan */
  const id = req.params.id;
  /* Hämtar datan för en specifik bok */
  db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
    /* Om fel */
    if (err) {
      /* Skickar status '500' och felmeddelandet */
      res.status(500).json({error: err.message});
    }
    else {
      /* Svarar med bokens data i JSON-format */
      res.json(row);
    }
  });
});