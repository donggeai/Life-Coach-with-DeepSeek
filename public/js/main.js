document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    // 添加消息到聊天区域
    function addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `<p>${content}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 显示加载动画
    function showLoadingAnimation() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-animation';
        loadingDiv.style.display = 'block';
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return loadingDiv;
    }

    // 处理用户发送消息
    async function handleSendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // 显示用户消息
        addMessage(message, 'user');
        messageInput.value = '';

        // 显示加载动画
        const loadingAnimation = showLoadingAnimation();

        try {
            // 发送请求到后端
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) throw new Error('网络请求失败');

            // 移除加载动画
            loadingAnimation.remove();

            // 处理流式响应
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiMessage = '';
            let messageDiv = null;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const data = line.slice(5).trim();
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.content;

                            if (content) {
                                aiMessage += content;
                                if (!messageDiv) {
                                    messageDiv = document.createElement('div');
                                    messageDiv.className = 'message ai';
                                    messageDiv.innerHTML = `<p>${aiMessage}</p>`;
                                    chatMessages.appendChild(messageDiv);
                                } else {
                                    messageDiv.innerHTML = `<p>${aiMessage}</p>`;
                                }
                                chatMessages.scrollTop = chatMessages.scrollHeight;
                            }
                        } catch (e) {
                            console.error('解析响应数据失败:', e);
                        }
                    }
                }
            }
        } catch (error) {
            // 发生错误时移除加载动画
            loadingAnimation.remove();
            console.error('请求失败:', error);
            addMessage('抱歉，发生了一些错误，请稍后重试。', 'system');
        }
    }

    // 发送按钮点击事件
    sendButton.addEventListener('click', handleSendMessage);

    // 输入框回车事件
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
});