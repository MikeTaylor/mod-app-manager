import express from 'express';
import serveIndex from 'serve-index';
import bodyParser from 'body-parser';
import getAppsFromGitHub from './github';
import CrudToConfig from './crudToConfig';


async function serveModAddStore(logger, port, config) {
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


  const c2c = new CrudToConfig('APPSTORE', undefined, 'source-');
  await c2c.login(config.folioInfo);

  const app = express();
  app.use(bodyParser.text({ type: () => true }));

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
    <li><a href="/app-store/config/sources">Configure sources</a></li>
    <li><a href="/app-store/apps">Apps</a></li>
    <li><a href="/htdocs/">Static area</a></li>
    <li><a href="/target/">Generated descriptors</a></li>
  </ul>
  `);
  });

  app.get('/admin/health', (req, res) => {
    res.send('Behold! I live!!');
  });

  app.get('/app-store/apps', async (req, res) => {
    returnOrReport(res, () => getAppsFromGitHub(config.sources));
  });

  app.get('/app-store/config/sources', async (req, res) => {
    returnOrReport(res, () => c2c.list());
  });

  app.post('/app-store/config/sources', async (req, res) => {
    const record = req.body;
    returnOrReport(res, () => c2c.add(record));
  });

  app.put('/app-store/config/sources/:id', async (req, res) => {
    const id = req.params.id;
    const record = req.body;
    returnOrReport(res, () => c2c.update(id, record));
  });

  app.delete('/app-store/config/sources/:id', async (req, res) => {
    const id = req.params.id;
    returnOrReport(res, () => c2c.delete(id));
  });

  app.use('/htdocs', express.static('etc/htdocs'), serveIndex('etc/htdocs', { view: 'details' }));

  // Allow module descriptors to be accessed via HTTP, just because we can
  app.use('/target', express.static('target'), serveIndex('target', { view: 'details' }));

  app.listen(port, () => {
    logger.log('listen', `mod-app-store listening on port ${port}`);
  });
}


export default serveModAddStore;
