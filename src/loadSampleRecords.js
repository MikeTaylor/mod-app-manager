import sampleRecords from './sampleRecords';

async function loadSampleRecords(logger, req, c2c) {
  // eslint-disable-next-line no-console
  logger.log('sample', 'TODO: add sample records', sampleRecords);
  for (const record of sampleRecords) {
    const string = JSON.stringify(record);
    await c2c.add(req, string);
  }
}

export default loadSampleRecords;
