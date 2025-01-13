import react from '@vitejs/plugin-react'
import {defineConfig} from 'vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@configurations': '/src/configurations',
			'@components': '/src/components',
			'@interfaces': '/src/interfaces',
			'@libraries': '/src/libraries',
			'@utilities': '/src/utilities',
			'@constants': '/src/constants',
			'@services': '/src/services',
			'@contexts': '/src/contexts',
			'@helpers': '/src/helpers',
			'@screens': '/src/screens',
			'@assets': '/src/assets',
			'@styles': '/src/styles',
			'@hooks': '/src/hooks'
		}
	}
})
