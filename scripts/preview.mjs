// Local static preview only. No API, writes, or backend storage.
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
const root = 'dist/client';
const port = Number(process.env.WEDDING_PREVIEW_PORT || 4201);
const routes = new Map();
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.avif':'image/avif','.woff2':'font/woff2','.woff':'font/woff','.mp3':'audio/mpeg','.ogg':'audio/ogg','.m4a':'audio/mp4'};
async function collect(dir, prefix='') {
  for (const item of await readdir(dir,{withFileTypes:true})) {
    const name = prefix + item.name;
    if (item.isDirectory()) await collect(join(dir,item.name),name+'/');
    else if (item.isFile() && mime[name.slice(name.lastIndexOf('.'))]) routes.set('/'+name,join(dir,item.name));
  }
}
await collect(root);
routes.set('/',join(root,'index.html'));
const headers = Object.fromEntries((await readFile(join(root,'_headers'),'utf8')).split(/\r?\n/).filter(l=>/^\s+[^:]+: /.test(l)).map(l=>{const i=l.indexOf(':');return [l.slice(0,i).trim(),l.slice(i+1).trim()];}));
createServer(async (req,res) => {
  try {
    const pathname = new URL(req.url,'http://localhost').pathname;
    const file = routes.get(pathname);
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405,headers);res.end();return; }
    if (!file) {res.writeHead(404,headers);res.end('Not found');return;}
    const data=await readFile(file);
    res.writeHead(200,{...headers,'Content-Type':mime[file.slice(file.lastIndexOf('.'))],'Content-Length':data.length});
    res.end(req.method==='HEAD'?undefined:data);
  } catch {res.writeHead(500,headers);res.end('Preview unavailable');}
}).listen(port,'127.0.0.1',()=>console.log(`Production preview: http://127.0.0.1:${port} (security headers enabled)`));
