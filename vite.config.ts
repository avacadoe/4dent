import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig({
	plugins: [
		react(),
	],
	server: {
		host: true,
		allowedHosts: [
			'localhost',
			'.trycloudflare.com',
		],
		cors: {
			origin: '*',
			credentials: true,
		},
		hmr: {
			clientPort: 443,
		},
	},
	resolve: {
		alias: {
			"node:crypto": "crypto-browserify",
			"node:buffer": "buffer",
			"node:stream": "stream-browserify",
			"node:util": "util",
			"node:process": "process/browser",
			buffer: 'buffer',
			process: 'process/browser',
			util: 'util',
		},
	},
	build: {
		commonjsOptions: {
			transformMixedEsModules: true,
		},
		rollupOptions: {
			plugins: [
				nodePolyfills() as any,
			],
			external: [],
		}
	},
	optimizeDeps: {
		include: ['@tanstack/react-query'],
		esbuildOptions: {
			define: {
				global: 'globalThis',
			},
			plugins: [
				NodeGlobalsPolyfillPlugin({
					process: true,
					buffer: true,
				}),
				NodeModulesPolyfillPlugin(),
			],
		},
	},
});
