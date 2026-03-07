const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8081;
const DB_FILE = path.join(__dirname, 'database.json');

// Ensure database file exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

function readDB() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
    console.log(`[REQ] ${req.method} ${req.url}`);

    // Serve HTML Application
    if (req.url === '/' && req.method === 'GET') {
        const htmlPath = path.join(__dirname, 'buildwise_pro.html');
        if (fs.existsSync(htmlPath)) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fs.readFileSync(htmlPath));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('buildwise_pro.html not found');
        }
        return;
    }

    // Serve Login Page
    if (req.url === '/login' && req.method === 'GET') {
        const loginPath = path.join(__dirname, 'login.html');
        if (fs.existsSync(loginPath)) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fs.readFileSync(loginPath));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('login.html not found');
        }
        return;
    }

    // API Routes
    if (req.url.startsWith('/api/v1')) {
        res.setHeader('Content-Type', 'application/json');

        // CORS Headers just in case
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        // Parse Request Body Function
        const getBody = () => new Promise((resolve) => {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
                try { resolve(body ? JSON.parse(body) : {}); }
                catch (e) { resolve({}); }
            });
        });

        // GET History
        if (req.method === 'GET' && req.url === '/api/v1/projects') {
            const data = readDB();
            res.writeHead(200);
            res.end(JSON.stringify({ status: 200, data: data }));
            return;
        }

        // POST to save a record
        if (req.method === 'POST' && req.url === '/api/v1/history/save') {
            getBody().then(body => {
                const data = readDB();
                const record = {
                    id: Date.now(),
                    type: body.type || 'Unknown',
                    details: body.details || '',
                    timestamp: new Date().toLocaleString()
                };
                data.push(record);
                writeDB(data);
                res.writeHead(201);
                res.end(JSON.stringify({ status: 201, message: 'Record saved', record }));
            });
            return;
        }

        // DELETE a record by ID
        if (req.method === 'DELETE' && req.url.startsWith('/api/v1/history/clear/')) {
            const id = parseInt(req.url.split('/').pop());
            let data = readDB();
            data = data.filter(r => r.id !== id);
            writeDB(data);
            res.writeHead(200);
            res.end(JSON.stringify({ status: 200, message: `Record ${id} deleted` }));
            return;
        }

        // DELETE All History
        if (req.method === 'DELETE' && req.url === '/api/v1/history/clear') {
            writeDB([]);
            res.writeHead(200);
            res.end(JSON.stringify({ status: 204, message: 'History cleared successfully' }));
            return;
        }

        // Simulated external APIs (AI Plan / Estimate)
        if (req.method === 'POST' && req.url === '/api/v1/plan/generate') {
            res.writeHead(201);
            res.end(JSON.stringify({ status: 201, message: "Plan auto-generated", id: Date.now() }));
            return;
        }
        if (req.method === 'GET' && req.url === '/api/v1/cost/estimate') {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 200, multiplier: 1.3, rate: 1500 }));
            return;
        }

        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found' }));
        return;
    }

    res.writeHead(404);
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`BuildWise Backend Server is running!`);
    console.log(`Access the application at: http://localhost:${PORT}`);
    console.log(`Logs will appear below:`);
    console.log(`-------------------------------------------`);
});
