const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const http = require('http');
const db = require('./db');
const { getPlantDiagnosis } = require('./agent');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  ws.on('error', console.error);
  ws.on('message', (message) => {
    // Echo or handle live commands
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "message", data: message.toString() }));
      }
    });
  });
});

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // OPEN
      client.send(JSON.stringify(data));
    }
  });
}

// Routes
app.post('/api/plants', (req, res) => {
  const { name, species, water_frequency_days } = req.body;
  db.run(
    `INSERT INTO plants (name, species, water_frequency_days) VALUES (?, ?, ?)`,
    [name, species, water_frequency_days || 7],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      const id = this.lastID;
      db.run(
        `INSERT INTO care_logs (plant_id, action, notes) VALUES (?, ?, ?)`,
        [id, 'added', 'Plant added to inventory'],
        () => {
          db.get(`SELECT * FROM plants WHERE id = ?`, [id], (err, row) => {
            res.json(row);
          });
        }
      );
    }
  );
});

app.get('/api/plants', (req, res) => {
  db.all(`SELECT * FROM plants`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/plants/:id/water', (req, res) => {
  const plantId = parseInt(req.params.id);
  const now = new Date().toISOString();

  db.run(
    `UPDATE plants SET last_watered = ? WHERE id = ?`,
    [now, plantId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Plant not found" });

      db.run(
        `INSERT INTO care_logs (plant_id, action, notes, timestamp) VALUES (?, ?, ?, ?)`,
        [plantId, 'watered', 'Smart watered via app', now],
        () => {
          const payload = {
            event: 'plant_watered',
            plant_id: plantId,
            last_watered: now
          };
          broadcast(payload);
          res.json({ message: "Plant watered successfully", last_watered: now });
        }
      );
    }
  );
});

app.delete('/api/plants/:id', (req, res) => {
  const plantId = parseInt(req.params.id);
  db.run(
    `DELETE FROM plants WHERE id = ?`,
    [plantId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Plant not found" });

      db.run(`DELETE FROM care_logs WHERE plant_id = ?`, [plantId]);

      broadcast({ event: 'plant_deleted', plant_id: plantId });
      res.json({ message: "Plant deleted successfully" });
    }
  );
});

app.post('/api/diagnose', async (req, res) => {
  const { plant_name, symptoms } = req.body;
  if (!plant_name || !symptoms) return res.status(400).json({ error: "Missing parameters" });

  const diagnosis = await getPlantDiagnosis(plant_name, symptoms);
  res.json({ diagnosis });
});

const initialPort = process.env.PORT || 8000;

function startServer(port) {
  server.listen(port)
    .on('listening', () => {
      console.log(`✅ Node Backend with WebSockets running extremely well on http://localhost:${port}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${port} is in use. Trying port ${port + 1}...`);
        startServer(port + 1); // Automatically try the next port up
      } else {
        console.error('An unexpected error occurred:', err);
      }
    });
}

startServer(initialPort);