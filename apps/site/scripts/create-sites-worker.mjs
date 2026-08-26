import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const entrypoint = resolve('dist/server/index.js');
const worker = `const hasFileExtension = (pathname) => /\\/[^/]+\\.[^/]+$/.test(pathname);

const requestAsset = (request, env, pathname) => {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = pathname;
  return env.ASSETS.fetch(new Request(assetUrl, request));
};

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404 || request.method !== 'GET' || hasFileExtension(new URL(request.url).pathname)) {
      return response;
    }

    const pathname = new URL(request.url).pathname;
    const indexPath = pathname.endsWith('/') ? pathname + 'index.html' : pathname + '/index.html';
    return requestAsset(request, env, indexPath);
  },
};
`;

await mkdir(resolve('dist/server'), { recursive: true });
await writeFile(entrypoint, worker, 'utf8');
