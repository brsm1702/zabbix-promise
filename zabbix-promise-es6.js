'use strict';

/**
 * Class representing Zabbix API client
 */
export default class Zabbix {
    /**
     * Create Zabbix API client.
     * @param {string} url - Zabbix API url e.g. http://localhost/zabbix/api_jsonrpc.php
     * @param {string} user - Zabbix user name
     * @param {string} password - Zabbix user password
     */
    constructor(url, user, password) {
        this.url = url;
        this.user = user;
        this.password = password;
    }

    /**
     * Call Zabbix API method.
     * @param {string} method - Zabbix API method like "trigger.get", "host.create"
     * @param {object} params - params object like {filter: {host: ["Zabbix server"]}}
     * @return {Promise} Promise object
     */
    call(method, params) {
        const request = {
            jsonrpc: '2.0',
            id: '1',
            auth: this.auth,
            method: method,
            params: params
        };
        return this._postJsonRpc(this.url, JSON.stringify(request))
            .then(r => {
                return Promise.resolve(JSON.parse(r));
            });
    }
    
    /**
     * Log in Zabbix server.
     * @return {Promise} Promise object
     */
    login() {
        const params = {
            user: this.user,
            password: this.password
        };
        return this.call('user.login', params)
            .then(result => {
                const reply = result;
                this.auth = reply.result;
                if (this.auth === undefined) {
                    return Promise.reject(new Error(JSON.stringify(reply.error)));
                }
                return Promise.resolve(result);
            });
    }

    /**
     * Log out from Zabbix server.
     * @return {Promise} Promise object
     */
    logout() {
        return this.call('user.logout', null)
            .then(result => {
                const reply = result;
                if (reply.result === true) {
                    this.auth = undefined;
                    return Promise.resolve(result);
                } else {
                    return Promise.reject(new Error(JSON.stringify(reply.error)));
                }
            });
    }

    _postJsonRpc(url, data) {
        return new Promise((resolve, reject) => {
            const method = 'POST';
            const client = new XMLHttpRequest();
            client.open(method, url);
            client.setRequestHeader('Content-Type', 'application/json-rpc');
            client.send(data);
            client.onload = function () {
                 if (this.status >= 200 && this.status < 300) {
                     resolve(this.response);
                 } else {
                     reject(`HTTP status ${this.statusText} was returned.`);
                 }
            };
            client.onerror = function () {
                reject('XMLHTTP request error occurred.');
            };
        });
    }
}
