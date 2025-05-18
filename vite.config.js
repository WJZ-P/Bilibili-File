import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        monkey({
            entry: 'src/main.js',
            userscript: {
                name: 'Bilibili File',
                description: "一款基于哔哩哔哩弹幕网(B站)的文件托管插件（￣▽￣）",
                author: 'https://github.com/WJZ-P',
                icon: 'https://i0.hdslb.com/bfs/material_up/12d89bc3fa38ffd23e1e8bad1e26037ddcf2f152.png',//脚本图标
                namespace: 'npm/bilibili-file',//脚本的命名空间
                match: ['https://www.bilibili.com/*'],
                //grant: ['GM_cookie', 'GM_xmlhttpRequest'],
            },
            build: {
                externalGlobals: {//告诉vite把vue作为外部资源处理，而不是打包到脚本中
                    vue: ['Vue', () => 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/3.2.31/vue.runtime.global.prod.min.js'],
                },
            },
        }),
    ],
    build: {
        minify: false,
        terserOptions: {
            compress: false, // 禁用 JS 压缩
            mangle: false    // 禁用变量名混淆
        }
    }
});
