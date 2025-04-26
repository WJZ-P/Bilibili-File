import {createApp} from 'vue';
import './style.css';
import App from './App.vue';

createApp(App).mount(
    (() => {
        if (document.contentType !== 'text/html') return

        const app = document.createElement('div');
        // 添加样式隔离
        // 确保添加到body最外层
        document.documentElement.prepend(app);
        return app;
    })()
);

//尝试加上我自己的按钮，方案是复制B站的
