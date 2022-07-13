/* eslint-disable no-console */

import fs from 'fs';
import optParser from 'node-getopt';
import Logger from './src/configuredLogger';
import serveModAddStore from './src/service';
import packageInfo from './package';

const logger = new Logger();

const argv0 = process.argv[1].replace(/.*\//, '');
const opt = optParser.create([
  ['p', 'port=NUMBER', 'Listen on port', 3002],
  ['V', 'version', 'Show version and exit'],
  ['h', 'help', 'Display this help'],
])
  .setHelp(`Usage:\n  ${argv0} [OPTIONS] <configFile>\n\nOptions:\n[[OPTIONS]]\n`)
  .bindHelp()
  .parseSystem();

if (opt.options.version) {
  console.log(`${argv0} version ${packageInfo.version}`);
  process.exit(0);
}

if (opt.argv.length !== 1) {
  console.info(opt.getHelp());
  process.exit(1);
}

const configFile = opt.argv[0];
const config = JSON.parse(fs.readFileSync(configFile).toString());
logger.log('config', config);

serveModAddStore(logger, opt.options.port);
