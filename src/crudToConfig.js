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
    return 'id-of-new-record';
  }

  async update(id, record) {
    return undefined;
  }

  async delete(id) {
    return undefined;
  }
}

export default CrudToConfig;
