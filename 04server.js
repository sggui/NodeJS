import { createServer } from 'http';
import { URL } from 'url';
import { readFile, readFileSync } from 'fs';

export const server = createServer((req, res) => {
  console.log(`\n[${new Date().toISOString()}] Recebendo requisição: ${req.url}`);

  const url = new URL(req.url, `http://${req.headers.host}`);

  // Rota /teste
  if (url.pathname === '/teste') {
    res.end('Teste deu ok');
  }
  // Rota /nome?usuario=nome
  else if (url.pathname === '/nome') {
    const usuario = url.searchParams.get('usuario');
    res.end(usuario ? `Opa ${usuario}` : 'Opa visitante');
  }
  // Rota /arquivosync (leitura síncrona)
  else if (url.pathname === '/arquivosync') {
    console.time('Tempo de leitura síncrona'); // Marca o tempo inicial
  try {
    const data = readFileSync('arquivosync.txt', 'utf-8'); // Leitura síncrona bloqueante
    console.timeEnd('Tempo de leitura síncrona'); // Marca o tempo final (corrigido o label)
    res.end(`(Sincrono) Arquivo lido:\n${data}`);
} catch (error) {
  console.error('Erro ao ler o arquivo:', error);
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Erro ao ler o arquivo.');
  }
  
}
  // Rota /arquivoasync (leitura assíncrona)
  else if (url.pathname === '/arquivoasync') {
    console.log(`[${new Date().toISOString()}] Iniciando leitura assincrona.`);
    console.time('Tempo de leitura assincrona'); // Marca o tempo inicial

    readFile('arquivoasync.txt', 'utf-8', (err, data) => {
      console.timeEnd('Tempo de leitura assincrona'); // Marca o tempo final
      if (err) {
        console.error('Erro ao ler o arquivo:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro ao ler o arquivo.');
      } else {
        res.end(`(Assincrono) Arquivo lido:\n${data}`);
      }
    });

    console.log(`[${new Date().toISOString()}] Requisição assincrona continua executando.`);
  }
  // Caso não corresponda a nenhuma rota
  else {
    res.end('Opa BCC');
  }
});