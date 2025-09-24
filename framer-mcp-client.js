#!/usr/bin/env node

const https = require('https');
const url = 'https://mcp.unframer.co/sse?id=f4023c78be427878439bc13f6ebce014b895696b7d4e9f9f1b26fbe83f0ac99b&secret=mPsuTZoRtDYdmHVYEupjB9IHTWinSN5o';

console.log('Connecting to Framer MCP...');

const req = https.get(url, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  res.on('data', (chunk) => {
    process.stdout.write(chunk);
  });
  
  res.on('end', () => {
    console.log('Connection ended');
  });
});

req.on('error', (err) => {
  console.error('Connection error:', err);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('Connection timeout');
  req.destroy();
  process.exit(1);
});

req.setTimeout(10000);



