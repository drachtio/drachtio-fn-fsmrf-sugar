# drachtio-fn-fsmrf-sugar

Utility functions for [drachtio-fsmrf](https://www.npmjs.com/package/drachtio-fsmrf)

## Loadbalancer

Class that allows you to select the least-loaded media server

```js
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
lb.start({servers, mrf});

// then call this repeatedly to the current least loaded media server
const ms = lb.getLeastLoaded();
```