import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, {cdn} from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        monkey({
            entry: 'src/main.js',
            userscript: {
                icon: 'https://vitejs.dev/logo.svg',//脚本图标
                namespace: 'npm/bilibili-file',//脚本的命名空间
                match: ['https://www.bilibili.com/*'],
            },
            build: {
                externalGlobals: {//告诉vite把vue作为外部资源处理，而不是打包到脚本中
                    vue: ['Vue', () => 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/3.2.31/vue.cjs.min.js'],
                },
            },
        }),
    ],
});
