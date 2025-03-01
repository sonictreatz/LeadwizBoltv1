// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Add resolution for .web.jsx extensions
const { resolver } = config;
resolver.sourceExts.push('web.jsx');
resolver.sourceExts.push('web.js');

module.exports = config;