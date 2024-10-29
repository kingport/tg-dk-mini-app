import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import type { ConfigEnv } from 'vite';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';
import svgr from 'vite-plugin-svgr';
import legacy from '@vitejs/plugin-legacy';
import mkcert from 'vite-plugin-mkcert';

// const inject = require('@rollup/plugin-inject');
// const esbuildShim = require.resolve('node-stdlib-browser/helpers/esbuild/shim');
import nodePolyfills from 'vite-plugin-node-stdlib-browser';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default async ({ command, mode }: ConfigEnv) => {
  // const { default: stdLibBrowser } = await import('node-stdlib-browser');
  const currentEnv = loadEnv(mode, process.cwd());
  console.log('当前模式', command);
  console.log('当前环境配置', currentEnv); //loadEnv即加载根目录下.env.[mode]环境配置文件
  return defineConfig({
    esbuild: {
      target: ['es2015'],
    },
    plugins: [
      mkcert(),
      legacy({
        targets: ['defaults', 'not IE 11'],
        renderLegacyChunks: false,
      }),
      react(),
      svgr(),
      AutoImport({
        imports: ['react', 'mobx', 'react-router-dom'],
        dts: './src/auto-imports.d.ts',
        dirs: ['src/store'],
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        },
      }),
      createSvgIconsPlugin({
        iconDirs: [path.join(__dirname, 'src/assets/icons')],
      }),
      NodeGlobalsPolyfillPlugin({
        buffer: true,
        process: true,
      }),
      nodePolyfills(),
    ],

    //项目部署的基础路径,
    base: currentEnv.VITE_PUBLIC_PATH,
    mode: mode,
    resolve: {
      // alias: stdLibBrowser,
      //别名
      alias: [
        { find: '@', replacement: resolve(__dirname, './src') },
        {
          find: '@components',
          replacement: resolve(__dirname, './src/components'),
        },
        {
          find: '@pages',
          replacement: resolve(__dirname, './src/pages'),
        },
        { find: '@store', replacement: resolve(__dirname, './src/store') },
        { find: '@pages', replacement: resolve(__dirname, './src/pages') },
        { find: '@assets', replacement: resolve(__dirname, './src/assets') },
        { find: '@hooks', replacement: resolve(__dirname, './src/hooks') },
      ],
    },
    optimizeDeps: {
      include: ['@ant-design/icons', 'buffer', 'process'],
    },
    //服务
    // server: {
    //   https: true, // 启用 HTTPS
    //   // host: 'localhost', // 你可以根据需要更改主机
    //   // port: 3000, // 你可以根据需要更改端口
    // },
    // server: {
    //   port: 5174,
    //   watch: {
    //     usePolling: true,
    //   },
    //   //自定义代理---解决跨域
    //   proxy: {
    //     // 选项写法
    //     '/api': {
    //       target: 'http://ec2-c-a.ulab.eu.org',
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/api/, ''),
    //     },
    //   },
    // },
    css: {
      // css预处理器
      preprocessorOptions: {
        sass: {
          javascriptEnabled: true,
        },
        less: {
          // 支持内联 JavaScript
          javascriptEnabled: true,
        },
      },
    },
    //构建
    build: {
      // cssCodeSplit: false,
      // outDir: `dist_${format(new Date(), 'yyyyMMdd_HHmm')}`, //输出路径  新增打日期包
      //构建后是否生成 source map 文件
      sourcemap: false,
      // esbuild 打包更快，但是不能去除 console.log，去除 console 使用 terser 模式
      minify: 'esbuild',
      outDir: ['production'].includes(currentEnv.VITE_MODE) ? './bth-front-prod' : './bth-front',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('antd-mobile')) {
              return 'antd-mobile';
            }
          },
        },
      },
    },
  });
};
