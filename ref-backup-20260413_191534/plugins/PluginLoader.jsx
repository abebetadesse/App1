import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Spinner } from 'react-bootstrap';

// Plugin registry (can be extended from backend)
export const pluginRegistry = {
  // Form plugins
  contactForm: {
    name: 'Contact Form Pro',
    version: '1.0.0',
    type: 'form',
    enabled: true,
    component: () => import('../components/forms/ContactFormPro'),
    css: null,
    settings: { submitEndpoint: '/api/contact', recaptcha: false }
  },
  surveyForm: {
    name: 'Feedback Survey',
    version: '1.0.0',
    type: 'form',
    enabled: false,
    component: () => import('../components/forms/SurveyForm'),
    css: null,
    settings: { questions: 5, anonymous: true }
  },
  // Theme plugins (additional themes)
  themeMatrix: {
    name: 'Matrix Theme',
    version: '1.0.0',
    type: 'theme',
    enabled: false,
    css: 'https://cdn.jsdelivr.net/npm/bootstrap-dark-5@1.1.3/dist/css/bootstrap-dark.min.css',
    variables: { '--primary': '#00ff41', '--bg-primary': '#0a0a0a' }
  },
  // Widget plugins
  weatherWidget: {
    name: 'Weather Widget',
    version: '1.0.0',
    type: 'widget',
    enabled: false,
    component: () => import('../components/widgets/WeatherWidget'),
    css: null
  },
  newsTicker: {
    name: 'News Ticker',
    version: '1.0.0',
    type: 'widget',
    enabled: false,
    component: () => import('../components/widgets/NewsTicker'),
    css: null
  }
};

export const loadPluginComponent = (pluginId) => {
  const plugin = pluginRegistry[pluginId];
  if (plugin && plugin.component) {
    return lazy(plugin.component);
  }
  return null;
};

export const loadPluginCSS = (pluginId) => {
  const plugin = pluginRegistry[pluginId];
  if (plugin && plugin.css && !document.querySelector(`link[href="${plugin.css}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = plugin.css;
    document.head.appendChild(link);
  }
};

export const enablePlugin = (pluginId) => {
  pluginRegistry[pluginId].enabled = true;
  if (pluginRegistry[pluginId].css) loadPluginCSS(pluginId);
  localStorage.setItem(`plugin_${pluginId}`, 'enabled');
};

export const disablePlugin = (pluginId) => {
  pluginRegistry[pluginId].enabled = false;
  const plugin = pluginRegistry[pluginId];
  if (plugin.css) {
    const link = document.querySelector(`link[href="${plugin.css}"]`);
    if (link) link.remove();
  }
  localStorage.setItem(`plugin_${pluginId}`, 'disabled');
};

export const initPlugins = () => {
  Object.keys(pluginRegistry).forEach(id => {
    const saved = localStorage.getItem(`plugin_${id}`);
    if (saved === 'enabled') enablePlugin(id);
    else if (saved === 'disabled') disablePlugin(id);
  });
};

export const getAllPlugins = () => Object.keys(pluginRegistry).map(key => ({ id: key, ...pluginRegistry[key] }));
