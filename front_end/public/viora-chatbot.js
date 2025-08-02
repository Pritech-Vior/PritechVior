// Viora Chatbot Embed Script
// Usage: Add this script tag to your website: <script src="path/to/viora-chatbot.js"></script>

(function() {
    'use strict';
    
    // Configuration
    const config = {
        apiEndpoint: 'https://api.pritechvior.co.tz/chat', // Replace with your actual API endpoint
        botName: 'Viora',
        companyName: 'PritechVior',
        primaryColor: '#AC6AFF',
        secondaryColor: '#FFC876',
        position: 'bottom-right', // Options: bottom-right, bottom-left
        autoOpen: false,
        showNotification: true
    };

    // Styles
    const styles = `
        .viora-chatbot-container {
            position: fixed;
            ${config.position.includes('right') ? 'right: 24px;' : 'left: 24px;'}
            bottom: 24px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .viora-chat-button {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%);
            border-radius: 50%;
            border: none;
            cursor: pointer;
            box-shadow: 0 8px 32px rgba(172, 106, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
            position: relative;
        }
        
        .viora-chat-button:hover {
            transform: scale(1.05);
        }
        
        .viora-chat-button svg {
            width: 24px;
            height: 24px;
            color: white;
        }
        
        .viora-notification {
            position: absolute;
            top: -4px;
            right: -4px;
            width: 16px;
            height: 16px;
            background: #ef4444;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: white;
            font-weight: bold;
        }
        
        .viora-chat-window {
            position: absolute;
            bottom: 80px;
            ${config.position.includes('right') ? 'right: 0;' : 'left: 0;'}
            width: 384px;
            max-width: calc(100vw - 48px);
            height: 600px;
            max-height: calc(100vh - 120px);
            background: #15131D;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #252134;
        }
        
        .viora-chat-window.open {
            display: flex;
        }
        
        /* Add all other styles from the HTML file here */
        /* ... (styles truncated for brevity) ... */
    `;

    // HTML Template
    const chatbotHTML = `
        <div class="viora-chatbot-container" id="vioraChatbotContainer">
            <button class="viora-chat-button" id="vioraChatButton">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                ${config.showNotification ? '<div class="viora-notification">1</div>' : ''}
            </button>
            
            <div class="viora-chat-window" id="vioraChatWindow">
                <!-- Chat window content -->
            </div>
        </div>
    `;

    // Chatbot Class
    class VioraChatbotEmbed {
        constructor() {
            this.isLoaded = false;
            this.messages = [];
            this.isTyping = false;
            
            this.init();
        }

        init() {
            // Inject styles
            this.injectStyles();
            
            // Create chatbot HTML
            this.createChatbot();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Mark as loaded
            this.isLoaded = true;
            
            // Auto-open if configured
            if (config.autoOpen) {
                setTimeout(() => this.openChat(), 1000);
            }
        }

        injectStyles() {
            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        createChatbot() {
            const container = document.createElement('div');
            container.innerHTML = chatbotHTML;
            document.body.appendChild(container.firstElementChild);
            
            // Get references
            this.container = document.getElementById('vioraChatbotContainer');
            this.button = document.getElementById('vioraChatButton');
            this.window = document.getElementById('vioraChatWindow');
        }

        setupEventListeners() {
            this.button.addEventListener('click', () => this.toggleChat());
            
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!this.container.contains(e.target)) {
                    this.closeChat();
                }
            });
        }

        toggleChat() {
            if (this.window.classList.contains('open')) {
                this.closeChat();
            } else {
                this.openChat();
            }
        }

        openChat() {
            this.window.classList.add('open');
            
            // Hide notification
            const notification = this.button.querySelector('.viora-notification');
            if (notification) {
                notification.style.display = 'none';
            }
            
            // Send welcome message if first time
            if (this.messages.length === 0) {
                this.addWelcomeMessage();
            }
        }

        closeChat() {
            this.window.classList.remove('open');
        }

        addWelcomeMessage() {
            const welcomeMessage = {
                text: `Hello! I'm ${config.botName}, your ${config.companyName} assistant. How can I help you today?`,
                sender: 'bot',
                options: ['Services & Solutions', 'Shop & Products', 'Student Projects', 'General Inquiry']
            };
            
            this.messages.push(welcomeMessage);
            this.renderMessage(welcomeMessage);
        }

        renderMessage(message) {
            // Implementation for rendering messages
            console.log('Rendering message:', message);
        }

        async sendMessage(text) {
            // Add user message
            const userMessage = { text, sender: 'user', timestamp: new Date() };
            this.messages.push(userMessage);
            this.renderMessage(userMessage);

            // Show typing indicator
            this.showTyping();

            try {
                // Send to API or use local responses
                const response = config.apiEndpoint ? 
                    await this.sendToAPI(text) : 
                    this.getLocalResponse(text);

                // Hide typing and show response
                this.hideTyping();
                const botMessage = { 
                    text: response.text, 
                    sender: 'bot', 
                    timestamp: new Date(),
                    options: response.options 
                };
                
                this.messages.push(botMessage);
                this.renderMessage(botMessage);
                
            } catch (error) {
                this.hideTyping();
                console.error('Chat error:', error);
                
                const errorMessage = {
                    text: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact us directly.",
                    sender: 'bot',
                    timestamp: new Date()
                };
                
                this.messages.push(errorMessage);
                this.renderMessage(errorMessage);
            }
        }

        async sendToAPI(message) {
            const response = await fetch(config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message, 
                    session_id: this.getSessionId() 
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            return await response.json();
        }

        getLocalResponse(message) {
            // Fallback local responses
            const responses = {
                'services': {
                    text: "We offer comprehensive IT solutions including:\n\n• Project Design & Implementation\n• IT Consulting & Innovation\n• E-Learning Platform\n• E-Commerce Solutions\n\nWhich service interests you?",
                    options: ["Project Development", "Consulting", "E-Learning", "E-Commerce"]
                },
                'contact': {
                    text: "Get in touch with us:\n\n• Email: info@pritechvior.co.tz\n• Phone: +255 XXX XXX XXX\n• Website: pritechvior.co.tz",
                    options: ["Send Email", "Call Us", "Visit Website"]
                }
            };

            const lowerMessage = message.toLowerCase();
            for (const [key, response] of Object.entries(responses)) {
                if (lowerMessage.includes(key)) {
                    return response;
                }
            }

            return {
                text: "Thanks for your message! I'd be happy to help you learn more about PritechVior's services. What specific information are you looking for?",
                options: ["Our Services", "Contact Info", "About Us"]
            };
        }

        getSessionId() {
            let sessionId = localStorage.getItem('viora_session_id');
            if (!sessionId) {
                sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('viora_session_id', sessionId);
            }
            return sessionId;
        }

        showTyping() {
            this.isTyping = true;
            // Implementation for typing indicator
        }

        hideTyping() {
            this.isTyping = false;
            // Implementation to hide typing indicator
        }
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.VioraChatbot = new VioraChatbotEmbed();
        });
    } else {
        window.VioraChatbot = new VioraChatbotEmbed();
    }

    // Expose global methods
    window.VioraChatbot = window.VioraChatbot || {};
    window.VioraChatbot.open = () => window.VioraChatbot.openChat && window.VioraChatbot.openChat();
    window.VioraChatbot.close = () => window.VioraChatbot.closeChat && window.VioraChatbot.closeChat();
    window.VioraChatbot.sendMessage = (msg) => window.VioraChatbot.sendMessage && window.VioraChatbot.sendMessage(msg);

})();
