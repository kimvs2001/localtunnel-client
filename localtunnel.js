const Tunnel = require('./lib/Tunnel');

module.exports = function localtunnel(arg1, arg2, arg3) {
  //typeof arg1 :  object
  // typeof arg2 :  undefined
  const options = typeof arg1 === 'object' ? arg1 : { ...arg2, port: arg1 };
  const callback = typeof arg1 === 'object' ? arg2 : arg3;
  const client = new Tunnel(options);
  if (callback) {

    client.open(err => (err ? callback(err) : callback(null, client)));
    return client;
  }
  return new Promise((resolve, reject) =>
    {
      console.log("localutnnel.js,  trying to client open");
      client.open(err => (err ? reject(err) : resolve(client)))
    }
  );
};
