import express from 'express';
import serveIndex from 'serve-index';
import { Octokit } from '@octokit/rest';
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
    const apps = {};

    config.forEach(async appSource => {
      const directory = await octokit.rest.repos.getContent({
        owner: appSource.owner,
        repo: appSource.repo,
        path: 'apps',
      });

      directory.data.forEach(async entry => {
        const file = await octokit.rest.repos.getContent({
          owner: appSource.owner,
          repo: appSource.repo,
          path: `apps/${entry.name}`,
        });

        const encoding = file.data.encoding;
        // XXX reject non-base64
        const content = file.data.content;
        const cleaned = content.replace(/[\r\n]/g, '');
        const decoded = atob(cleaned);
        console.log('file', entry.name, `(${encoding})`, '--', decoded);
        apps[entry.name] = decoded;
      });

      console.log('apps =', apps);
    });

    res.send(JSON.stringify(apps));
  });

  // Allow module descriptors to be accessed via HTTP, just because we can
  app.use('/target', express.static('target'), serveIndex('target', { view: 'details' }));

  app.listen(port, () => {
    logger.log('listen', `mod-app-store listening on port ${port}`);
  });
}


export default serveModAddStore;
