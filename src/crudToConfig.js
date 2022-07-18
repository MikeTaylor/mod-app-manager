/* eslint-disable no-console */

import fetch from 'node-fetch';


class CrudToConfig {
  constructor(module, user, prefix) {
    this.module = module;
    this.user = user;
    this.prefix = prefix;
  }

  async okapiFetch(path, options) {
    return fetch(this.url + '/' + path, {
      ...options,
      headers: {
        ...options.headers,
        'Content-type': 'application/json',
        'X-Okapi-Tenant': this.tenant,
        'X-Okapi-Token': this.token || ''
      }
    });
  }

  async login(folioInfo) {
    this.url = folioInfo.url;
    this.tenant = folioInfo.tenant;

    const credentials = { username: folioInfo.username, password: folioInfo.password };
    const response = await this.okapiFetch('authn/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const text = await response.text();
      throw Error(`Fetch error: ${response.statusText}: ${text}`);
    }

    const json = await response.json();
    this.token = json.okapiToken;
  }

  async list() {
    return [
      {
        owner: 'fiona',
        repo: 'whatever',
        token: '123abc',
      }
    ];
  }

  async add(record) {
    console.log('adding record', record);
    return 'id-of-new-record';
  }

  async update(id, record) {
    console.log('updating record', id, 'to', record);
    return undefined;
  }

  async delete(id) {
    console.log('deleting record', id);
    return undefined;
  }
}

export default CrudToConfig;
