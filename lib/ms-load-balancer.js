const assert = require('assert');
const Emitter = require('events');
const noop = () => {};

class LoadBalancer extends Emitter {
  constructor() {
    super();

    this.active = [];
    this.inactive = [];
  }

  start({servers, logger, mrf}) {
    assert.ok(Array.isArray(servers) && servers.length > 0, 
      'opts.servers is required and must be an array of configuration options for Freeswitch');
    assert.ok(mrf, 'opts.mrf is required');

    this.servers = servers;
    this.mrf = mrf;
    this.logger = logger || {info: noop, debug: noop, error: noop};
    return this._init();
  }

  async _init() {
    for (const server of this.servers) {
      try {
        const ms = await this.mrf.connect(server);
        this.logger.info(`successfully connected to freeswitch at ${ms.address}`);
        this.active.push(ms);
      }
      catch (err) {
        this.logger.info(err, `Error connecting to freeswitch at ${server.host}`);
        this.inactive.push(server);
      }
    }
    if (this.active.length > 0) this.emit('connect');
    return;
  }

  getLeastLoaded() {
    return this.active.sort((a, b) => (b.maxSessions - b.currentSessions) - (a.maxSessions - a.currentSessions));
  }

  disconnect() {
    return this.active.map((ms) => ms.disconnect());
  }
}

module.exports = LoadBalancer;
