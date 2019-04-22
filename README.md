# drachtio-fn-fsmrf-sugar

Utility functions for [drachtio-fsmrf](https://www.npmjs.com/package/drachtio-fsmrf)

## loadbalancer

Function to return the least-loaded media server

```js
const {loadbalancer} = require('drachtio-fn-fsmrf-sugar');

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
const getLeastLoaded = loadbalancer({
  servers, mrf
});

// then call this repeatedly to the current least loaded media server
const ms = getLeastLoaded();
```