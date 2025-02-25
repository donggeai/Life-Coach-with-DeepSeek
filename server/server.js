require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// DeepSeek API配置
const API_KEY = '46b356ac-b155-4d74-b9fa-066513cd0682';
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

// 处理聊天请求
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-r1-250120',
                messages: [
                    {
                        role: 'system',
                        content: '你是一位专业的生活教练，擅长倾听、分析和给出建议。你的目标是通过对话帮助用户发现问题的本质，并提供实用的建议来促进他们的个人成长。你应该表现得友好、专业且富有同理心。'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.6,
                stream: true
            })
        });

        // 设置SSE响应头
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        // 处理流式响应
        response.body.pipe(require('stream').Transform({
            transform(chunk, encoding, callback) {
                const decoder = new TextDecoder();
                const text = decoder.decode(chunk);
                const lines = text.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const data = line.slice(5).trim();
                        if (data === '[DONE]') {
                            this.push('data: [DONE]\n\n');
                            continue;
                        }
                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices[0].delta.content || '';
                            if (content) {
                                this.push(`data: ${JSON.stringify({ content })}\n\n`);
                            }
                        } catch (e) {
                            console.error('解析响应数据失败:', e);
                        }
                    }
                }
                callback();
            }
        })).pipe(res);
    } catch (error) {
        console.error('API请求失败:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});