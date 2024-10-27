import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'Amos',
  tagline:
    'A decentralized, data-driven, all-in-one state management solution for large-scale applications.',
  favicon: 'img/amos.ico',

  // Set the production url of your site here
  url: 'https://amos-project.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/amos/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'amos-project', // Usually your GitHub org/user name.
  projectName: 'amos', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themes: [
    '@docusaurus/theme-live-codeblock',
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/amos-project/amos/tree/main/website/',
          remarkPlugins: [
            [
              require('@docusaurus/remark-plugin-npm2yarn'),
              {
                sync: true,
                converters: ['yarn', 'pnpm'],
              },
            ],
          ],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/card.png',
    navbar: {
      title: 'Amos',
      logo: {
        alt: 'Amos',
        src: 'img/amos.svg',
      },
      items: [
        {
          type: 'doc',
          label: 'Get started',
          docId: 'Introduction/get-started',
          position: 'left',
        },
        {
          type: 'doc',
          label: 'Usage Guide',
          docId: 'Basics/store',
          position: 'left',
        },
        {
          type: 'doc',
          label: 'Ecosystem',
          docId: 'Ecosystem/ssr',
          position: 'left',
        },
        {
          type: 'doc',
          label: 'React',
          docId: 'React/provider',
          position: 'left',
        },
        {
          type: 'doc',
          label: 'API',
          docId: 'API/core',
          position: 'left',
        },
        {
          href: 'https://github.com/amos-project/amos',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} acrazing and Amos project authors.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      appId: 'ZY0PEBSY83',
      apiKey: 'ad9a8bee80a6f07ea33038e023435924',
      indexName: 'amos-projectio',
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
