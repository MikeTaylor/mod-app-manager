async function getSingleApp(octokit, source, name) {
  const file = await octokit.rest.repos.getContent({
    owner: source.owner,
    repo: source.repo,
    path: `apps/${name}`,
  });

  const encoding = file.data.encoding;
  if (encoding !== 'base64') {
    throw Error(`app ${name} has non-base64 encoding '${encoding}'`);
  }

  const cleaned = file.data.content.replace(/[\r\n]/g, ''); // Should not be necessary!
  const decoded = atob(cleaned);
  return JSON.parse(decoded);
}


async function getAppsForSource(octokit, source) {
  const apps = {};

  const directory = await octokit.rest.repos.getContent({
    owner: source.owner,
    repo: source.repo,
    path: 'apps',
  });

  for (const entry of directory.data.values()) {
    const app = await getSingleApp(octokit, source, entry.name);
    apps[app.name] = app;
  }

  return apps;
}


async function getAppsFromGitHub(octokit, config) {
  const apps = {};

  for (const source of config.values()) {
    const someApps = await getAppsForSource(octokit, source);
    Object.assign(apps, someApps);
  }

  return apps;
}


export default getAppsFromGitHub;
