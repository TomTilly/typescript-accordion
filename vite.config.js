const path = require('path');
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'AccordionJS',
      formats: ['cjs', 'es', 'iife', 'umd'],
      fileName: (format) => `accordion.${format}.js`
    }
  }
});