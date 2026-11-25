import http from 'http';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const hostname = 'localhost';
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDirectory = path.join(__dirname, 'public');

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.ico': 'image/x-icon',
    '.csv': 'text/csv'
};

const server = http.createServer((req, res) => {
    const requestUrl = new URL(req.url, `http://${hostname}`);
    let pathname;

    try {
        pathname = decodeURIComponent(requestUrl.pathname);
    } catch {
        res.writeHead(400);
        return res.end('Bad Request');
    }

    let filename = path.resolve(
        publicDirectory,
        '.' + pathname
    );

    // Prevent access to files outside the public directory
    if (
        filename !== publicDirectory &&
        !filename.startsWith(publicDirectory + path.sep)
    ) {
        res.writeHead(403);
        return res.end('Forbidden');
    }

    let ext = path.extname(filename);

    if (pathname.endsWith('/') || ext === '') {
        ext = '.html';
        filename = path.join(filename, 'index.html');
    }

    fs.readFile(filename, (err, data) => {
        if (err) {
            res.writeHead(404);
            return res.end('File Not Found');
        }

        res.writeHead(200, {
            'Content-Type': mimeTypes[ext]
        });
        return res.end(data);
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});