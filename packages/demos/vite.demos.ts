import type { UserConfig } from 'vite';
import * as path from 'path';

import reactRefresh from '@vitejs/plugin-react-refresh';
import svgr from 'vite-plugin-svgr';
import mdx from 'vite-plugin-mdx';
import pages, { DefaultPageStrategy } from 'vite-plugin-react-pages';

module.exports = {
  jsx: 'react',
  plugins: [
    reactRefresh(),
    svgr(),
    mdx(),
    pages({
      pagesDir: path.join(__dirname, 'pages'),
      pageStrategy: new DefaultPageStrategy({
        extraFindPages: async (pagesDir, helpers) => {
          const demosBasePath = path.join(__dirname, '../');
          // find all component demos
          helpers.watchFiles(
            demosBasePath,
            '*/**/demos/**/*.{[tj]sx,md?(x)}',
            async function fileHandler(file, api) {
              const { relative, path: absolute } = file;
              const match = relative.match(
                /(.*)\/(.*)\/demos\/(.*)\.([tj]sx|mdx?)$/
              );
              if (!match) throw new Error('unexpected file: ' + absolute);
              const [, , componentName, demoPath] = match;
              const pageId = `/${componentName}`;
              const runtimeDataPaths = api.getRuntimeData(pageId);
              runtimeDataPaths[demoPath] = absolute;
              const staticData = api.getStaticData(pageId);
              staticData[demoPath] = await helpers.extractStaticData(file);
              if (!staticData.title)
                staticData.title = `${componentName} Title`;
            }
          );

          // find all component README
          helpers.watchFiles(
            demosBasePath,
            '*/**/README.md?(x)',
            async function fileHandler(file, api) {
              const { relative, path: absolute } = file;
              const match = relative.match(/(.*)\/(.*)\/README\.mdx?$/);
              if (!match) throw new Error('unexpected file: ' + absolute);
              const [, , componentName] = match;
              const pageId = `/${componentName}`;
              const runtimeDataPaths = api.getRuntimeData(pageId);
              runtimeDataPaths['README'] = absolute;
              const staticData = api.getStaticData(pageId);
              staticData['README'] = await helpers.extractStaticData(file);
              // make sure the title data is bound to this file
              staticData.title = undefined;
              staticData.title =
                staticData['README'].title ?? `${componentName} Title`;
            }
          );
        },
      }),
    }),
  ],
  resolve: {
    alias: {
      '@axelor-ui/core': path.resolve(__dirname, '../core/src'),
    },
  },
  ssr: {
    // should not external them in ssr build,
    // otherwise the ssr bundle will contains `require("@axelor-ui/core")`
    // which will result in error
    noExternal: ['@axelor-ui/core'],
  },
  minify: false,
} as UserConfig;
