# Zabbix API with ES6 Promise

This is a promise-based javascript library for Zabbix API. This library works as a single js file in web browser. There is no dependency to other libraries such as jquery or node modules. You can use this library by loading one of the js files below depending on your environment.

- **zabbix-promise-es6.js**: ES6 class version for pure ES6 environment like babel
- **zabbix-promise.js**: Babel-compiled version for Chrome, Firefox and Edge

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
### ES6
For ECMAScript6 users, import zabbix-promise-es6.js instead of zabbix-promise.js.
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

# Reference

## Class: Zabbix

### Zabbix.constructor(url, user, password)
Create Zabbix API client.

**Parameters**

**url**: `string`, Zabbix API URL e.g. http://localhost/zabbix/api_jsonrpc.php 

**user**: `string`, Zabbix user name

**password**: `string`, Zabbix user password

### Zabbix.call(method, params)

Call Zabbix API method.

**Parameters**

**method**: `string`, Zabbix API method like "trigger.get", "host.create"

**params**: `object`, params object like {filter: {host: ["Zabbix server"]}}

**Returns**: `Promise`, Promise object

### Zabbix.login()

Log in Zabbix server.

**Returns**: `Promise`, Promise object

### Zabbix.logout()

Log out from Zabbix server.

**Returns**: `Promise`, Promise object



* * *
