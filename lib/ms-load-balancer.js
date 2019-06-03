const assert = require('assert');
const Mrf = require('drachtio-fsmrf');
const Emitter = require('events');
const noop = () => {};

class LoadBalancer extends Emitter {
  constructor() {
    super();

    this.active = [];
    this.inactive = [];
  }

  start({servers, logger, mrf, srf}) {
    assert.ok(Array.isArray(servers) && servers.length > 0, 
      'opts.servers is required and must be an array of configuration options for Freeswitch');
    assert.ok(mrf || srf, 'either opts.srf or opts.mrf is required');

    this.servers = servers;
    this.mrf = mrf || new Mrf(srf);
    this.logger = logger || {info: noop, debug: noop, error: noop};
    return this._init();
  }

  async _init() {
    const servers = [];
    if (this.inactive.length > 0) {
      servers.push(...this.inactive);
      this.inactive.length = 0;
    }
    else {
      servers.push(...this.servers);
    }
    this.logger.debug(`attempting to connect to ${JSON.stringify(servers)}`);

    for (const server of servers) {
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
    if (this.inactive.length > 0) {
      this.timerId = setTimeout(this._init.bind(this), 5000);
    }
    return;
  }

  get activeCount() {
    return this.active.length;
  }

  getLeastLoaded() {
    return this.active.sort((a, b) => (b.maxSessions - b.currentSessions) - (a.maxSessions - a.currentSessions));
  }

  getMsBySipAddress(addr) {
    return this.active.find((ms) => ms.sip.ipv4.udp && ms.sip.ipv4.udp.address === addr);
  }

  getMsByEslAddress(addr) {
    return this.active.find((ms) => ms.address === addr);
  }

  disconnect() {
    if (this.timerId) clearTimeout(this.timerId);
    return this.active.map((ms) => ms.disconnect());
  }
}

module.exports = LoadBalancer;
