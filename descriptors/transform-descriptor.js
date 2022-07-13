#!/usr/bin/node

const fs = require('fs');

const p = fs.readFileSync('package.json').toString();
const j = JSON.parse(p);
const name = j.name.replace(/.*\//, '');
const version = j.version;

// argv[0] is the interpreter binary, [1] is the script, [2] is the first actual argument
const raw = fs.readFileSync(process.argv[2]).toString();
const cooked = raw
  .replace(/\${artifactId}/g, name)
  .replace(/\${version}/g, version);

process.stdout.write(cooked);
