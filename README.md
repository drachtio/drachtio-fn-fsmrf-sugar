# drachtio-fn-fsmrf-sugar

Utility functions for [drachtio-fsmrf](https://www.npmjs.com/package/drachtio-fsmrf)

## Loadbalancer

Class that allows you to select the least-loaded media server

```js
const Srf = require('drachtio-srf');
const srf = new Srf();
const {Loadbalancer} = require('drachtio-fn-fsmrf-sugar');
const lb = new Loadbalancer();
/*
  servers = [
  {
    address: '10.100.0.1', 
    port: 8021, 
    secret: 'ClueCon'
  },
  {
    address: '10.100.0.2', 
    port: 8021, 
    secret: 'ClueCon'
  }]
*/
// call this once to connect to the array of media servers
lb.start({servers, srf});

// then call this to get an array of available media server, with least loaded first
const mediaservers = lb.getLeastLoaded();
// mediaservers[0] is the least loaded
```