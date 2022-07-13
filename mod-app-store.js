/* eslint-disable no-console */

import optParser from 'node-getopt';
import express from 'express';
import serveIndex from 'serve-index';
import Logger from './src/configuredLogger';
import packageInfo from './package';

const logger = new Logger();
const app = express();
let port = 3002;

const argv0 = process.argv[1].replace(/.*\//, '');
const opt = optParser.create([
  ['p', 'port=NUMBER', `Listen on port [default: ${port}]`],
  ['V', 'version', 'Show version and exit'],
  ['h', 'help', 'Display this help'],
])
  .bindHelp()
  .parseSystem();

if (opt.options.version) {
  console.log(`${argv0} version ${packageInfo.version}`);
  process.exit(0);
}

if (opt.argv.length !== 0) {
  console.info(opt.getHelp());
  process.exit(1);
}

port = opt.options.port;


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
