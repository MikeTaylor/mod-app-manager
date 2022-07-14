import express from 'express';
import serveIndex from 'serve-index';
import { Octokit } from '@octokit/rest';
import getAppsFromGitHub from './github';
import packageInfo from '../package';


function serveModAddStore(logger, port, config) {
  const octokit = new Octokit({
    auth: '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', // XXX pass on commmand-line
    userAgent: `FOLIO mod-app-store v${packageInfo.version}`,
  });

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

  app.get('/app-store/apps', async (req, res) => {
    try {
      const apps = await getAppsFromGitHub(octokit, config);
      res.send(JSON.stringify(apps));
    } catch (e) {
      res.status(500);
      res.send(e);
    }
  });

  // Allow module descriptors to be accessed via HTTP, just because we can
  app.use('/target', express.static('target'), serveIndex('target', { view: 'details' }));

  app.listen(port, () => {
    logger.log('listen', `mod-app-store listening on port ${port}`);
  });
}


export default serveModAddStore;
