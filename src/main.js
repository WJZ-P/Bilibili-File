import {createApp} from 'vue';
import './style.css';
import App from './App.vue';
import {credentials} from "./utils/upload.js";

const urls = ["https://www.bilibili.com/", "https://www.bilibili.com", "http://www.bilibili.com/", "http://www.bilibili.com"]

createApp(App).mount(
    (() => {
        if (document.contentType !== 'text/html' || window.location.href !== 'https://www.bilibili.com/bilibili-file') return

        const app = document.createElement('div');
        //先删掉本来的内容
        document.querySelector('.error-container').remove()
        document.body.append(app);
        return app;
    })()
);

console.log("[Bilibili-File] 启动")
//尝试获取bili_jct作为上传参数csrf。
// console.log(document.cookie)
credentials['bili_jct'] = document.cookie.split('; ').find(row => row.startsWith('bili_jct='))?.split('=')[1]
credentials['cookie'] = document.cookie
// console.log(credentials.bili_jct)
//尝试加上我自己的按钮，方案是复制B站的
if (urls.includes(window.location.href)) addMyBtn()
else console.log("[Bilibili-File] 不在B站首页，不添加上传按钮")

//如果当前是bilibili-file的路由，改一下标题
if(window.location.href.includes("bilibili-file")){
    document.title="文件上传 - Bilibili-File"
}
function addMyBtn() {
    //B站右上角的列表，最后一个元素的投稿
    const list = document.querySelector(".right-entry")
    const button = document.querySelector(".right-entry-item--upload")
    console.log(list)
    console.log(button)
    let cloneBtn;
    //复制一个button
    if (list && button) {
        cloneBtn = button.cloneNode(true)
        console.log(cloneBtn)
        cloneBtn.id = "bilibili-file-uploadFile"
        list.appendChild(cloneBtn)
    } else {
        console.log("[Bilibili-File] 元素未找到，添加上传按钮失败")
    }

    //接下来改动这个btn，内容换成自己的
    cloneBtn.querySelector('.header-upload-entry__text').textContent = "传输"
    cloneBtn.querySelector('.header-upload-entry__icon').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#ffffff"><path d="M450-224.62h60V-402l74 74 42.15-42.77L480-516.92 333.85-370.77l42.77 42.15L450-402v177.38ZM252.31-100Q222-100 201-121q-21-21-21-51.31v-615.38Q180-818 201-839q21-21 51.31-21H570l210 210v477.69Q780-142 759-121q-21 21-51.31 21H252.31ZM540-620v-180H252.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v615.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-620H540ZM240-800v180-180V-160v-640Z"/></svg>`

    //取消掉本来的监听
    cloneBtn.onclick = null;
    cloneBtn.removeAttribute("onclick")

    cloneBtn.addEventListener('click', (event) => {
        window.location.href = 'https://www.bilibili.com/bilibili-file'
    })
}