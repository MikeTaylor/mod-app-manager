import Logger from './src/configuredLogger';

const logger = new Logger();

const port = 3002; // XXX should provide a way to change this
logger.log('listen', `listening on port ${port}`);
// XXX do something
