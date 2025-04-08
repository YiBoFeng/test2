import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid({
  title: 'Moxo Integration',
  appearance: false,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    sidebar: [
      {
        items: [
          { text: 'Authentication', link: './authentication' },
          { text: 'Function', link: './function' },
          { text: 'Identity Function', link: './identity-function' },
          { text: 'Build Function', link: './build-function' },
          { text: 'Action Function', link: './action-function' },
          { text: 'Redirect Function', link: './redirect-function' },
          { text: 'Webhook Function', link: './webhook-function' },
          { text: 'Form Input Schema', link: './form-input-schema' },
        ],
      },
    ],
    search: {
      provider: 'local',
    },
  },
  // does not support relative base https://github.com/vuejs/vitepress/issues/3563
  base: '/integration/developer/docs/',
  outDir: '../dist/docs',
})
