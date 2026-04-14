export const pluginRegistry = {
  analytics: {
    name: 'Analytics Tracker',
    version: '1.0.0',
    description: 'Track user interactions and page views',
    author: 'Tham AI',
    enabled: false,
    js: null,
    css: null
  },
  chatWidget: {
    name: 'Live Chat Widget',
    version: '1.0.0',
    description: 'Real-time chat support widget',
    author: 'Tham AI',
    enabled: false,
    js: 'https://cdn.jsdelivr.net/npm/@chatscope/chat-ui-kit-react@2.0.0/dist/index.cjs',
    css: 'https://cdn.jsdelivr.net/npm/@chatscope/chat-ui-kit-styles@1.4.0/dist/default/styles.min.css'
  },
  googleAnalytics: {
    name: 'Google Analytics',
    version: '1.0.0',
    description: 'Track with Google Analytics 4',
    author: 'Google',
    enabled: false,
    js: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX',
    css: null
  },
  hotjar: {
    name: 'Hotjar Heatmaps',
    version: '1.0.0',
    description: 'User behavior analytics',
    author: 'Hotjar',
    enabled: false,
    js: 'https://static.hotjar.com/c/hotjar-xxxxxx.js',
    css: null
  }
};

export const loadPlugin = (pluginId) => {
  const plugin = pluginRegistry[pluginId];
  if (!plugin) return;
  if (plugin.js && !document.querySelector(`script[src="${plugin.js}"]`)) {
    const script = document.createElement('script');
    script.src = plugin.js;
    script.async = true;
    document.head.appendChild(script);
  }
  if (plugin.css && !document.querySelector(`link[href="${plugin.css}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = plugin.css;
    document.head.appendChild(link);
  }
};

export const unloadPlugin = (pluginId) => {
  const plugin = pluginRegistry[pluginId];
  if (plugin?.js) {
    const script = document.querySelector(`script[src="${plugin.js}"]`);
    if (script) script.remove();
  }
  if (plugin?.css) {
    const link = document.querySelector(`link[href="${plugin.css}"]`);
    if (link) link.remove();
  }
};

export const togglePlugin = (pluginId, enabled) => {
  if (enabled) loadPlugin(pluginId);
  else unloadPlugin(pluginId);
  pluginRegistry[pluginId].enabled = enabled;
  localStorage.setItem(`plugin_${pluginId}`, enabled);
};

export const initPlugins = () => {
  Object.keys(pluginRegistry).forEach(pluginId => {
    const saved = localStorage.getItem(`plugin_${pluginId}`);
    if (saved === 'true') {
      pluginRegistry[pluginId].enabled = true;
      loadPlugin(pluginId);
    }
  });
};

export const getAllPlugins = () => Object.keys(pluginRegistry).map(key => ({ id: key, ...pluginRegistry[key] }));
