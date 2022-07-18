class CrudToConfig {
  constructor(module, user, prefix) {
    this.module = module;
    this.user = user;
    this.prefix = prefix;

    console.log(`made new CrudToConfig with module=${module}, user=${user}, prefix=${prefix}`);
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
