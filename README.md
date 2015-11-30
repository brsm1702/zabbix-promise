# Zabbix API with ES6 Promise

This is a promise-base Zabbix API Library for JavaScript.  

## Installation

Download zabbix-promise.js and reference it in your js or html file.

### require()
```javascript
var Zabbix = require('./zabbix-promise.js');
```
### script tag in html
```html
<script src="./zabbix-promise.js"></script>
```
For ECMAScript6 users, import zabbix-promise-es6.js instead of zabbix-promise.js.
### ES6
```javascript
import Zabbix from './zabbix-promise-es6.js';
```

## Usage

```javascript
var zabbix = new Zabbix('http://localhost:8088/zabbix/api_jsonrpc.php', 'Admin', 'zabbix');
console.log("Logging in Zabbix...");
zabbix.login()
    .then(r => {
        console.log("Successfully logged in. Getting triggers...");
        return zabbix.call("trigger.get", {filter: {host: ["Zabbix server"]}});
    })
    .then(r => {
        console.log("Number of triggers: " + r.result.length);
        for(var i = 0; i < r.result.length; i++) {
            console.log("Trigger ID: " + r.result[i].triggerid + ", Description: " + r.result[i].description);
        };
        return zabbix.logout();
    })
    .then(r => {
        console.log("logged out.");
    })
    .catch(err => console.log(err));
```
Output:
```
Logging in Zabbix...
Successfully logged in. Getting triggers...
Number of triggers: 41
Trigger ID: 13509, Description: Host name of zabbix_agentd was changed on {HOST.NAME}
Trigger ID: 13491, Description: Zabbix agent on {HOST.NAME} is unreachable for 5 minutes
Trigger ID: 13492, Description: Version of zabbix_agent(d) was changed on {HOST.NAME}
Trigger ID: 13493, Description: Configured max number of opened files is too low on {HOST.NAME}
...
Trigger ID: 13490, Description: Less than 25% free in the trends cache
logged out.
```