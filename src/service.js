import express from 'express';
import serveIndex from 'serve-index';
import getAppsFromGitHub from './github';


function serveModAddStore(logger, port, config) {
  const returnOrReport = async (res, closure) => {
    try {
      const value = await closure();
      res.send(JSON.stringify(value));
    } catch (e) {
      logger.log('error', e.toString());
      res.status(500);
      res.send(e.toString());
    }
  };


  const app = express();

  app.use((req, res, next) => {
    const url = req.url; // This sometimes changes by the time res.once fires
    res.once('finish', () => {
      logger.log('request', req.method, url, '-->', res.statusCode, res.statusMessage);
    });

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

  app.get('/app-store/apps', async (req, res) => {
    returnOrReport(res, () => getAppsFromGitHub(config));
  });

  // Allow module descriptors to be accessed via HTTP, just because we can
  app.use('/target', express.static('target'), serveIndex('target', { view: 'details' }));

  app.listen(port, () => {
    logger.log('listen', `mod-app-store listening on port ${port}`);
  });
}


export default serveModAddStore;
