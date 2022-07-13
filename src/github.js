async function getSingleApp(octokit, source, name) {
  const file = await octokit.rest.repos.getContent({
    owner: source.owner,
    repo: source.repo,
    path: `apps/${name}`,
  });

  const encoding = file.data.encoding;
  // XXX should reject if non-base64

  const content = file.data.content;
  const cleaned = content.replace(/[\r\n]/g, '');
  const decoded = atob(cleaned);
  const json = JSON.parse(decoded);
  console.log('file', name, `(${encoding})`, '--', json);

  return [name, json];
}

async function getAppsForSource(octokit, source) {
  const bundle = {};

  const directory = await octokit.rest.repos.getContent({
    owner: source.owner,
    repo: source.repo,
    path: 'apps',
  });

  const keys = directory.data.keys();
  for (const key of keys) {
    const entry = directory.data[key];
    const app = await getSingleApp(octokit, source, entry.name);
    const [name, json] = app;
    bundle[name] = json;
  }

  return bundle;
}


async function getAppsFromGitHub(octokit, config) {
  const apps = {};

  const keys = config.keys();
  for (const key of keys) {
    const source = config[key];
    const bundle = await getAppsForSource(octokit, source);
    console.log('  bundle =', bundle);
    Object.assign(apps, bundle);
    console.log('apps =', apps);
  }

  return apps;
}


export default getAppsFromGitHub;
