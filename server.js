const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const ROOT = __dirname;
const UPSTREAM = 'https://api.xcvts.cn/api/video_qsy/juhe';

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
};

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname.startsWith('/api/')) {
        const target = UPSTREAM + url.search;
        try {
            const upstreamRes = await fetch(target, {
                headers: { 'Accept': 'application/json' },
                signal: AbortSignal.timeout(30000),
            });
            const body = await upstreamRes.text();
            res.writeHead(upstreamRes.status, {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
            });
            res.end(body);
        } catch (err) {
            res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: 0, msg: '代理请求失败：' + err.message }));
        }
        return;
    }

    let filePath = path.join(ROOT, url.pathname);
    if (filePath === ROOT || url.pathname === '/') {
        filePath = path.join(ROOT, 'index.html');
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (url.pathname.endsWith('/')) {
                const indexPath = path.join(filePath, 'index.html');
                return fs.readFile(indexPath, (err2, content2) => {
                    if (err2) {
                        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                        return res.end('404 Not Found');
                    }
                    res.writeHead(200, { 'Content-Type': MIME['.html'] });
                    res.end(content2);
                });
            }
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('404 Not Found');
        }

        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(content);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Preview server running at http://0.0.0.0:${PORT}`);
});
