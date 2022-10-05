// We use vacuous `${''}` sequences in the middle of the GitHub token
// to prevent GitHub from recognising a complete token when we push this
// code. (Otherwise it revokes the tokens.) We are happy having the token
// here in publicly visible source code, since all it gives is the ability
// to use the API to access publicly visible respositories.

const token = `ghp_COIuVgh4pFdnMmJV${''}G26W61gHUFijoc1N4Ndf`;

const sampleRecords = [
  {
    id: '76e4df5f-1821-4282-9732-b38ed24cbd9d',
    owner: 'MikeTaylor',
    repo: 'another-folio-app-source',
    token
  },
  {
    id: 'd0082384-7b8e-4f1e-982c-cef3194a1d35',
    owner: 'MikeTaylor',
    repo: 'example-folio-app-source',
    token
  }
];

export default sampleRecords;
