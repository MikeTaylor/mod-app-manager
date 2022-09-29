import sampleRecords from './sampleRecords';

async function loadSampleRecords(logger, req, c2c) {
  logger.log('sample', 'adding sample records', sampleRecords);
  const existingRecords = await c2c.list(req);
  const recordsById = {};
  existingRecords.forEach(record => {
    recordsById[record.id] = record;
  });

  for (const record of sampleRecords) {
    if (recordsById[record.id]) {
      logger.log('sample', 'NOT adding duplicate sample record', record.id);
    } else {
      const string = JSON.stringify(record);
      await c2c.add(req, string);
      logger.log('sample', 'adding sample record', record);
    }
  }
}

export default loadSampleRecords;
