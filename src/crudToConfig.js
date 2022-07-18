/* eslint-disable no-console */

import fetch from 'node-fetch';
import queryString from 'query-string';


class CrudToConfig {
  constructor(module, user, prefix) {
    this.module = module;
    this.user = user;
    this.prefix = prefix;
  }

  async okapiFetch(path, options) {
    const response = await fetch(this.url + '/' + path, {
      ...options,
      headers: {
        ...(options && options.headers),
        'Content-type': 'application/json',
        'X-Okapi-Tenant': this.tenant,
        'X-Okapi-Token': this.token || ''
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw Error(`Fetch error: ${response.statusText}: ${text}`);
    }

    return response;
  }

  async login(folioInfo) {
    this.url = folioInfo.url;
    this.tenant = folioInfo.tenant;

    const credentials = { username: folioInfo.username, password: folioInfo.password };
    const response = await this.okapiFetch('authn/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const json = await response.json();
    this.token = json.okapiToken;
  }

  async list() {
    let cql = `module="${this.module}"`;
    if (this.user) cql = cql + `and user="${this.user}"`;
    const search = queryString.stringify({ limit: 1000, query: cql });
    const response = await this.okapiFetch(`configurations/entries?${search}`);
    const json = await response.json();

    // XXX we should process this a bit, instead of just blindly passing it on
    return json;
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
