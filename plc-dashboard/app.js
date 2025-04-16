let snap7;
try {
    snap7 = require('node-snap7');
} catch (e) {
    console.warn('node-snap7 non disponibile. Le funzionalità PLC saranno disabilitate.');
}

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let plc;
let plcConnected = false;

if (snap7) {
    plc = new snap7.S7Client();
    const PLC_IP = "192.168.0.1";
    const PLC_RACK = 0;
    const PLC_SLOT = 1;

    plc.ConnectTo(PLC_IP, PLC_RACK, PLC_SLOT, function (err) {
        if (err) {
            console.error("Errore di connessione al PLC:", plc.ErrorText(err));
        } else {
            console.log("✅ Connesso al PLC!");
            plcConnected = true;
        }
    });
}

// Servire i file statici dalla cartella 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route per la home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API per leggere dati dal PLC
app.get('/plc/read', (req, res) => {
    if (!plcConnected) return res.status(503).json({ error: "PLC non connesso" });
    plc.ReadArea(snap7.S7AreaDB, 1, 0, 2, snap7.S7WordLen.Byte, (err, data) => {
        if (err) {
            res.status(500).json({ error: plc.ErrorText(err) });
        } else {
            res.json({ byte1: data[0], byte2: data[1] });
        }
    });
});

// API per scrivere dati nel PLC
app.post('/plc/program', express.json(), (req, res) => {
    if (!plcConnected) return res.status(503).json({ error: "PLC non connesso" });
    const programNumber = req.body.programNumber;
    const buffer = Buffer.from([programNumber]);
    plc.WriteArea(snap7.S7AreaDB, 1, 0, 1, snap7.S7WordLen.Byte, buffer, (err) => {
        if (err) {
            res.status(500).json({ error: plc.ErrorText(err) });
        } else {
            res.json({ success: true });
        }
    });
});

// API per avviare il robot
app.post('/plc/start', express.json(), (req, res) => {
    if (!plcConnected) return res.status(503).json({ error: "PLC non connesso" });
    const startSignal = Buffer.from([1]);
    plc.WriteArea(snap7.S7AreaDB, 1, 1, 1, snap7.S7WordLen.Byte, startSignal, (err) => {
        if (err) {
            res.status(500).json({ error: plc.ErrorText(err) });
        } else {
            res.json({ success: true });
        }
    });
});

// API per fermare il robot
app.post('/plc/stop', express.json(), (req, res) => {
    if (!plcConnected) return res.status(503).json({ error: "PLC non connesso" });
    const stopSignal = Buffer.from([0]);
    plc.WriteArea(snap7.S7AreaDB, 1, 1, 1, snap7.S7WordLen.Byte, stopSignal, (err) => {
        if (err) {
            res.status(500).json({ error: plc.ErrorText(err) });
        } else {
            res.json({ success: true });
        }
    });
});

// WebSocket per aggiornamenti in tempo reale
wss.on('connection', (ws) => {
    console.log('🧩 Client connesso al WebSocket');
    if (!plcConnected) return;

    const interval = setInterval(() => {
        plc.ReadArea(snap7.S7AreaDB, 1, 0, 2, snap7.S7WordLen.Byte, (err, data) => {
            if (!err) {
                ws.send(JSON.stringify({ byte1: data[0], byte2: data[1] }));
            }
        });
    }, 1000);

    ws.on('close', () => clearInterval(interval));
});

// Porta dinamica per ambienti cloud
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server avviato su http://localhost:${PORT}`);
});
