#!/usr/bin/env node
/* eslint-disable no-console */

http=require('http');

var url = require('url');

var querystring = require('querystring');

const openurl = require('openurl');

const localtunnel = require('./localtunnel');

var lt={};
lt.init = function(argv){

// console.log('hi');
// console.log(argv.port);
if (typeof argv.port !== 'number') {

// console.log('herer');
  yargs.showHelp();
  console.error('\nInvalid argument: `port` must be a number');
  process.exit(1);
}

lt.tunneling=async function(){

 
// console.log(argv.port);
// console.log(argv.host);
// console.log("subdomiat lt.js : ")
// console.log(argv.subdomain);

  const tunnel = await localtunnel({
    port: argv.port,
    host: argv.host,
    subdomain: argv.subdomain,
    local_host: argv.localHost,
    local_https: argv.localHttps,
    local_cert: argv.localCert,
    local_key: argv.localKey,
    local_ca: argv.localCa,
    allow_invalid_cert: argv.allowInvalidCert,
  }).catch(err => {
    console.log('[lt.js] localtunnel error');
    // return false;
    throw err;
  });
  
  //kjh test delete !!
  console.log("[lt.js] argv :  ",argv);

  // tunnel.on('error', err => {
  //   // console.log('error');
  //   // global.isConnected = false;
  //   // return false;
  //   throw err;
  // });

  tunnel.on('error', (err) => {
    throw err;
  });

  global.isConnected = true;
  console.log('your url is: %s', tunnel.url);
  // console.log('tunnel : ',tunnel);
  /**
   * `cachedUrl` is set when using a proxy server that support resource caching.
   * This URL generally remains available after the tunnel itself has closed.
   * @see https://github.com/localtunnel/localtunnel/pull/319#discussion_r319846289
   */
  if (tunnel.cachedUrl) {
    console.log('your cachedUrl is: %s', tunnel.cachedUrl);
  }

  if (argv.open) {
    openurl.open(tunnel.url);
  }

  if (argv['print-requests']) {
    tunnel.on('request', info => {
      console.log(new Date().toString(), info.method, info.path);
    });
  }
  // return true;
};

}
module.exports = lt;

