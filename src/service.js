import express from 'express';
import serveIndex from 'serve-index';
import bodyParser from 'body-parser';
import getAppsFromGitHub from './github';
import CrudToConfig from './crudToConfig';


async function serveModAddStore(logger, port, config) {
  const returnOrReport = async (res, closure, successStatus, doNotEncode) => {
    try {
      const value = await closure();
      if (successStatus) res.status(successStatus);
      if (doNotEncode) res.contentType('text/plain');
      res.send(doNotEncode ? value : JSON.stringify(value));
    } catch (e) {
      logger.log('error', e);
      res.status(500);
      res.send(e.toString());
    }
  };


  const c2c = new CrudToConfig(config.folioInfo, 'APP_MANAGER', undefined, 'source-');
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
  This is mod-app-manager. Try:
  <ul>
    <li><a href="/admin/health">Health check</a></li>
    <li><a href="/app-manager/config/sources">Configured sources</a></li>
    <li><a href="/app-manager/apps">Apps</a></li>
    <li><a href="/htdocs/">Static area</a></li>
    <li><a href="/target/">Generated descriptors</a></li>
  </ul>
  `);
  });

  app.post('/_/tenant', (req, res) => {
    const record = req.body;
    logger.log('tenant', record);
    res.status(204);
    res.send();
  });

  app.use('/_/tenant/:id', (req, res) => {
    const record = req.body;
    logger.log('tenant', `ID ${req.params.id}`, record);
    res.status(204);
    res.send();
  });

  app.get('/admin/health', (req, res) => {
    res.send('Behold! I live!!');
  });

  app.get('/app-manager/apps', async (req, res) => {
    const sourceConfig = await c2c.list(req);
    returnOrReport(res, () => getAppsFromGitHub(sourceConfig));
  });

  app.get('/app-manager/config/sources', async (req, res) => {
    returnOrReport(res, () => c2c.list(req));
  });

  app.post('/app-manager/config/sources', async (req, res) => {
    const record = req.body;
    returnOrReport(res, () => c2c.add(req, record), 201, true);
  });

  app.put('/app-manager/config/sources/:id', async (req, res) => {
    const id = req.params.id;
    const record = req.body;
    returnOrReport(res, () => c2c.update(req, id, record), 204);
  });

  app.delete('/app-manager/config/sources/:id', async (req, res) => {
    const id = req.params.id;
    returnOrReport(res, () => c2c.delete(req, id), 204);
  });

  app.use('/htdocs', express.static('etc/htdocs'), serveIndex('etc/htdocs', { view: 'details' }));

  // Allow module descriptors to be accessed via HTTP, just because we can
  app.use('/target', express.static('target'), serveIndex('target', { view: 'details' }));

  app.listen(port, () => {
    logger.log('listen', `mod-app-manager listening on port ${port}`);
  });
}


export default serveModAddStore;
