# AI生活教练对话网站

## 版本信息
当前版本：v0.1

## 项目简介
这是一个基于DeepSeek-R1 API开发的AI生活教练对话网站。通过与AI助手的对话，用户可以获得个性化的建议和指导，帮助个人成长。

## 已实现功能
### v0.1版本特性
- 基础用户界面
  - 响应式布局设计，完美适配各种设备屏幕
  - 现代简约的界面风格
  - 清晰的对话区域布局
- AI对话功能
  - 实时对话响应
  - 流式文本输出
  - 智能打字机效果显示
- 交互体验
  - 消息加载动画
  - 回车快捷发送
  - 自动滚动到最新消息

## 技术栈
- 前端：HTML5、CSS3、JavaScript
- 后端：Node.js
- API：火山方舟 DeepSeek-R1

## 项目结构
```
├── public/          # 静态资源目录
│   ├── css/         # 样式文件
│   ├── js/          # JavaScript文件
│   └── index.html   # 主页面
├── server/          # 后端服务器目录
│   └── server.js    # Node.js服务器文件
├── package.json     # 项目依赖配置
└── README.md       # 项目说明文档
```

## 使用说明
1. 在输入框中输入你想咨询的问题
2. 点击发送按钮或按回车键发送消息
3. AI助手将根据你的问题提供个性化建议

## 技术特性
- API请求超时时间：60秒
- 响应模式：流式输出
- AI温度参数：0.6（平衡创造性与准确性）