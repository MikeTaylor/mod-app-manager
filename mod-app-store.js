import express from 'express';
import serveIndex from 'serve-index';
import Logger from './src/configuredLogger';

const logger = new Logger();
const app = express();
const port = 3002; // XXX should provide a way to change this

app.get('/', (req, res) => {
  res.send(`
This is mod-app-store. Try:
<ul>
  <li><a href="/admin/health">Health check</a></li>
  <li><a href="/target/">Generated descriptors</a></li>
</ul>
`);
});

app.get('/admin/health', (req, res) => {
  res.send('Behold! I live!!');
});

// Allow module descriptors to be accessed via HTTP, just because we can
app.use('/target', express.static('target'), serveIndex('target', { view: 'details' }));

app.listen(port, () => {
  logger.log('listen', `mod-app-store listening on port ${port}`);
});
