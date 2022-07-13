import express from 'express';
import serveIndex from 'serve-index';


function serveModAddStore(logger, port, config) {
  const app = express();

  app.use((req, res, next) => {
    logger.log('request', req.method, req.url);
    next();
  });

  app.get('/', (req, res) => {
    res.send(`
  This is mod-app-store. Try:
  <ul>
    <li><a href="/admin/health">Health check</a></li>
    <li><a href="/app-store/apps">Apps</a></li>
    <li><a href="/target/">Generated descriptors</a></li>
  </ul>
  `);
  });

  app.get('/admin/health', (req, res) => {
    res.send('Behold! I live!!');
  });

  app.get('/app-store/apps', (req, res) => {
    res.send(JSON.stringify(config));
  });

  // Allow module descriptors to be accessed via HTTP, just because we can
  app.use('/target', express.static('target'), serveIndex('target', { view: 'details' }));

  app.listen(port, () => {
    logger.log('listen', `mod-app-store listening on port ${port}`);
  });
}


export default serveModAddStore;