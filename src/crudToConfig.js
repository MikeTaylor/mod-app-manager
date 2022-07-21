import fetch from 'node-fetch';
import queryString from 'query-string';
import { v4 as uuidv4 } from 'uuid';


class CrudToConfig {
  constructor(folioInfo, module, user, prefix) {
    this.folioInfo = folioInfo;
    this.module = module;
    this.user = user;
    this.prefix = prefix;
  }

  async okapiFetch(req, path, options) {
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

  async login(req) {
    this.url = this.folioInfo.url;
    this.tenant = this.folioInfo.tenant;

    const credentials = { username: this.folioInfo.username, password: this.folioInfo.password };
    const response = await this.okapiFetch(req, 'authn/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const json = await response.json();
    this.token = json.okapiToken;
  }

  async list(req) {
    await this.login(req);
    let cql = `module="${this.module}"`;
    if (this.user) cql += `and user="${this.user}"`;
    const search = queryString.stringify({ limit: 1000, query: cql });
    const response = await this.okapiFetch(req, `configurations/entries?${search}`);
    const json = await response.json();

    return json.configs.map(entry => {
      const values = JSON.parse(entry.value);
      return {
        id: entry.id,
        ...values,
      };
    });
  }

  async add(req, record) {
    await this.login(req);
    const uuid = uuidv4();
    const body = {
      configName: `${this.prefix}${uuid}`,
      module: this.module,
      value: record,
    };
    if (this.user) body.userId = this.user;

    const response = await this.okapiFetch(req, 'configurations/entries', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const json = await response.json();
    return json.id;
  }

  async update(req, id, record) {
    await this.login(req);
    const uuid = uuidv4(); // It's fine if this changes, we don't use the configName
    const body = {
      configName: `${this.prefix}${uuid}`,
      module: this.module,
      value: record,
    };
    if (this.user) body.userId = this.user;

    await this.okapiFetch(req, `configurations/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    // if there was no exception, then we're good to go
  }

  async delete(req, id) {
    await this.login(req);
    await this.okapiFetch(req, `configurations/entries/${id}`, {
      method: 'DELETE',
    });
    // if there was no exception, then we're good to go
  }
}

export default CrudToConfig;
