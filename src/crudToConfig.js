// The `id` field from the top-level mod-configuration record is
// injected into the domain-level app-source record to be the `id`
// used to address app-sources. When we create a record, the `id` is
// pulled out of the domain-level record supplied and inserted into
// the mod-configuration record.
//
// In mod-configuration, the `configName`, `module` and `user` fields
// together constitute a key (not the primary key, since that is
// `id`). Since `module` is constant in our records and `user` is not
// used, that means we need `configName` to be unique, even though we
// have no use for it otherwise. That is why we generate it using a
// UUID even though it's not an identifier.

import fetch from 'node-fetch';
import queryString from 'query-string';
import { v4 as uuidv4 } from 'uuid';


class CrudToConfig {
  constructor(folioInfo, module, user, prefix) {
    this.folioInfo = folioInfo;
    this.module = module;
    this.user = user;
    this.prefix = prefix;
    this.key2token = {};
  }

  folioUrl(req) { return req.get('x-okapi-url') || this.folioInfo.url; }
  folioTenant(req) { return req.get('x-okapi-tenant') || this.folioInfo.tenant; }
  requestKey(req) { return `${this.folioUrl(req)}*${this.folioTenant(req)}`; }

  async okapiFetch(req, path, options) {
    const token = this.key2token[this.requestKey(req)];
    const url = process.env.OKAPI_URL || this.folioUrl(req);

    const response = await fetch(url + '/' + path, {
      ...options,
      headers: {
        ...(options && options.headers),
        'Content-type': 'application/json',
        'X-Okapi-Tenant': this.folioTenant(req),
        'X-Okapi-Token': token || '',
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw Error(`Fetch error ${(options || {}).method || 'GET'} ${path}: ${response.statusText}: ${text}`);
    }

    return response;
  }

  async login(req) {
    const key = this.requestKey(req);
    const token = req.get('x-okapi-token');
    if (token) {
      // Even if we already have a token from earlier, there will be a
      // new one if the user has logged in again. So we overwrite our
      // old token in case the new session has different permissions
      // or has otherwise changed.
      this.key2token[key] = token;
      return;
    }

    const credentials = { username: this.folioInfo.username, password: this.folioInfo.password };
    const response = await this.okapiFetch(req, 'authn/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const json = await response.json();
    this.key2token[key] = json.okapiToken;
    // XXX Does it suffice to stash this, or is there a race-condition?
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
        ...values,
        id: entry.id,
      };
    });
  }

  async add(req, record) {
    await this.login(req);

    const obj = JSON.parse(record);
    const id = obj.id;
    delete obj.id;
    const uuid = uuidv4();

    const body = {
      id,
      configName: `${this.prefix}${uuid}`,
      module: this.module,
      value: JSON.stringify(obj),
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

    const obj = JSON.parse(record);
    delete obj.id;
    const uuid = uuidv4(); // It's fine if this changes, we don't use the configName

    const body = {
      configName: `${this.prefix}${uuid}`,
      module: this.module,
      value: JSON.stringify(obj),
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
