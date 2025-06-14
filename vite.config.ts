import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: 'localhost', 
		port: 5173,
		hmr: {
			protocol: 'ws', 
			host: 'localhost',
			port: 5173
		}
	}
});
