

const assert = require('assert');
const active = [], inactive = [];
const noop = () => {};

async function init({servers, logger, mrf}) {

  for (const server of servers) {
    try {
      const ms = await mrf.connect(server);
      logger.info(`successfully connected to freeswitch at ${ms.address}`);
      active.push(ms);
    }
    catch (err) {
      logger.info(err, `Error connecting to freeswitch at ${server.host}`);
      inactive.push(server);
    }
  }
}

module.exports = function({servers, logger, mrf}) {
  assert.ok(Array.isArray(servers) && servers.length > 0, 
    'opts.servers is required and must be an array of configuration options for Freeswitch');
  assert.ok(mrf, 'opts.mrf is required');

  logger = logger || {info: noop, debug: noop, error: noop};

  init({servers, logger, mrf});

  return function getLeastLoaded() {
    return active.sort((a, b) => (b.maxSessions - b.currentSessions) - (a.maxSessions - a.currentSessions));
  };
};
