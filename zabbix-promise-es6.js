'use strict';

export default class Zabbix {
    constructor(url, user, password) {
        this.url = url;
        this.user = user;
        this.password = password;
    }

    call(method, params) {
        const request = {
            jsonrpc: '2.0',
            id: '1',
            auth: this.auth,
            method: method,
            params: params
        };
        return this._postJsonRpc(this.url, JSON.stringify(request));
    }
    
    login() {
        const params = {
            user: this.user,
            password: this.password
        };
        return this.call('user.login', params)
            .then(result => {
                const reply = JSON.parse(result);
                this.auth = reply.result;
                if (this.auth === undefined) {
                    return Promise.reject(new Error(JSON.stringify(reply.error)));
                }
                return Promise.resolve(result);
            });
    }

    logout() {
        return this.call('user.logout', null)
            .then(result => {
                const reply = JSON.parse(result);
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
