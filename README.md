## 一款基于B站的文件托管插件。

<!-- PROJECT SHIELDS -->



<p align="center" style="margin-left: 50%">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

</p>

<!-- PROJECT LOGO -->

<p align="center">
  <a href="https://github.com/WJZ-P/Bilibili-File/">
    <img src="src/assests/bilibili.svg" alt="Logo" width="150" height="150" style="color: #66ccff;margin: 0">
  </a>
  <h1 align="center">Bilibili File</h1>
  <p align="center">
    <a href="https://github.com/WJZ-P/Bilibili-File">查看Demo</a>
    ·
    <a href="https://github.com/WJZ-P/Bilibili-File/issues">报告Bug</a>
    ·
    <a href="https://github.com/WJZ-P/Bilibili-File/issues">提出新特性</a>
  </p>
</p>

<p align="center">
  <a href="https://www.bilibili.com/video/BV1Yx411T7Uz">
    <img src="https://i0.hdslb.com/bfs/material_up/a704cbc91a40b39ea3c66b33daed66ce683d53fe.jpg" alt="CONNECT~心的连接~">
  </a>
</p>
<h2 align="center">"歌唱着BILIBILI 跟我一起 探寻这美丽的天地"</h2>

## 目录

- [Bilibili File](#projectname)
    - [目录](#目录)
        - [上手指南](#上手指南)
            - [前置要求](#前置要求)
            - [**插件安装步骤**](#安装步骤)
        - [**使用方法**](#使用方法)
        - [版权说明](#版权说明)
        - [鸣谢](#鸣谢)
        - [重要声明](#重要声明)

## 注意

#### 本插件仅供学习使用

## 上手指南

###### 前置要求

1. 请安装LiteLoader，项目地址为 https://github.com/LiteLoaderQQNT/LiteLoaderQQNT
   
2. 下面是社区开发的LiteLoader快捷安装脚本项目，新手请直接下载下面的即可。
   https://github.com/Mzdyl/LiteLoaderQQNT_Install/

#### 此处提供两个链接：

- [LiteLoader QQNT 下载地址](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/releases)
- [LiteLoader QQNT 安装脚本](https://github.com/Mzdyl/LiteLoaderQQNT_Install/releases)

#### 对于网络不好的用户，可以使用以下直链进行下载：
- [LiteLoader QQNT 安装器直链][LL-installer-link]
- [QQ9.9.15.26909_x64 版本直链][oldQQ-download-link]

###### 安装步骤


1. 下载release中的最新版本
2. 解压后把整个解压出来的文件夹拖动到Plugins目录下即可。
3. 重启QQ，LiteLoader会自动加载Encrypt Chat插件。

### 注意，如果使用了上面的install脚本安装liteloader，QQ设置会自带插件商店，在插件商店里可以一键安装本插件。

# 使用方法

## 1. 打开QQ，随便选择一个聊天对象。支持独立窗口加密
<p align="center">
  <a href="https://www.bilibili.com/video/BV12x411y7SN">
    <img src="src/assests/markdown/chatWindow.png" alt="聊天界面" style="width: 500px">
  </a>
</p>

## 2. 在聊天界面的输入栏右上方会有插件图标，点击即可启用，可以按Ctrl+E快速开关加密功能

<p align="center">
  <a href="https://www.bilibili.com/video/BV12x411y7SN">
    <img src="src/assests/markdown/funcBar.png" alt="功能窗口">
  </a>
</p>

## 3. 加密类型：
- ## 文字加密 
  - ### 打字，点击发送即可看到效果。显示的明文共有**六种**加密语，具体请在设置中查看。

- ## 图片加密 
  - ### 跟打字类似，直接发送即可。

- ## 文字加密 
  - ### 跟普通QQ上传文件的方式一样。需要在开启加密功能后再上传。由于限制只支持**20M**以下文件的发送。
  

### 加密对比图如下：
<div style="display: flex; justify-content: center; align-items: center;">
  <a href="https://www.bilibili.com/video/BV12x411y7SN">
    <img src="src/assests/markdown/encryptedMessage.png" alt="消息">
  </a>
  <a href="https://www.bilibili.com/video/BV12x411y7SN">
    <img src="src/assests/markdown/normalMessage.png" alt="消息" style="width: 400px">
  </a>
  <a href="https://www.bilibili.com/video/BV12x411y7SN">
    <img src="src/assests/markdown/encryptedFile.png" alt="消息" style="width: 500px">
  </a>
</div>

## 4.更多内容请在QQ设置中查看

## 版权说明

该项目签署了EPL-2.0 license
授权许可，详情请参阅 [LICENSE](https://github.com/WJZ-P/Bilibili-File/blob/main/LICENSE)

## 鸣谢

- [LiteLoader QQNT](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT?tab=readme-ov-file)
- [LiteLoader Euphony](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT?tab=readme-ov-file)
- [NapCat](https://github.com/NapNeko/NapCatQQ)
- [LLOneBot](https://github.com/LLOneBot/LLOneBot)


## 重要声明
### 本项目仅供交流学习使用，**禁止**用于一切非法用途！任何问题概不负责。(｡•́︿•̀｡) 

### **因项目特殊性，不接受任何形式的赞助、捐赠等基于本项目的利益输送行为。**

## 📝 To Do List

- [x] **支持图片加密**
   - [x] 实现对图片文件的加密功能，保护用户隐私。

    
- [x] **支持文件加密**  
   - [x] 提供对文件格式的加密支持。


- [x] **消息使用 MD5 校验**
   - [x] 使用aes-256-gcm算法，自带哈希校验。


- [x] **支持修改主题色**  
   - [x] 允许用户自定义应用的主题颜色，提升用户体验。


- [x] **支持更多的语种**  
   - [x]  当前仅为bangboo语，后续增加喵喵语等


- [x] **增加开启快捷键** (已完成,Ctrl+E)
   - [x] ctrl+e比较合适


- [x] **支持单独群，QQ 用户单独密钥** (部分实现，实现群密钥)
   - [x] 为不同的群组提供独立的加密密钥。
   - [x] 为不同的QQ用户提供单独加密密钥。

- [ ] **支持时间轮转密钥** 
   - [ ] 使得加密消息有时间限制，无法查看之前时间段的加密内容。


### 待修复bug

- ~~右键复制解密消息时，复制到的文本依然是原文~~(现在支持默认密钥消息的复制)
- ~~解密后如果是URL，URL不可点击~~
- ~~多开独立窗口时，只有主窗口的加密会生效。~~
- ~~发送较大图片时，因为QQ默认不下载原图，会导致解密失败，需要双击原图图片才可以正常渲染~~
- 发表情包应该注意大小，不要以图片的格式发，太大了
- ~~引用回复加密消息，引用中的还是密文~~
## 如果您喜欢本项目，请给我点个⭐吧(๑>◡<๑)！

## ⭐ Star 历史

[![Stargazers over time](https://starchart.cc/WJZ-P/Bilibili-File.svg?variant=adaptive)](https://starchart.cc/WJZ-P/Bilibili-File)
<!-- links -->

[your-project-path]:WJZ-P/Bilibili-File

[contributors-shield]: https://img.shields.io/github/contributors/WJZ-P/Bilibili-File.svg?style=flat-square

[contributors-url]: https://github.com/WJZ-P/Bilibili-File/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/WJZ-P/Bilibili-File.svg?style=flat-square

[forks-url]: https://github.com/WJZ-P/Bilibili-File/network/members

[stars-shield]: https://img.shields.io/github/stars/WJZ-P/Bilibili-File.svg?style=flat-square

[stars-url]: https://github.com/WJZ-P/Bilibili-File/stargazers

[issues-shield]: https://img.shields.io/github/issues/WJZ-P/Bilibili-File.svg?style=flat-square

[issues-url]: https://img.shields.io/github/issues/WJZ-P/Bilibili-File.svg

[license-shield]: https://img.shields.io/github/license/WJZ-P/Bilibili-File.svg?style=flat-square

[license-url]: https://github.com/WJZ-P/Bilibili-File/blob/main/LICENSE

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555

[linkedin-url]: https://linkedin.com/in/shaojintian

[oldQQ-download-link]:https://dldir1.qq.com/qqfile/qq/QQNT/448e164c/QQ9.9.15.26909_x64.exe

[LL-installer-link]:https://ats-prod.oss-accelerate.aliyuncs.com/18734247705198dcb594916e8ba1facc

[//]: # (不知道写点啥)