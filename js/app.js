// js/app.js

const initializeAIAssistant = () => {
    const assistantWidget = document.getElementById('ai-assistant-widget');
    if (!assistantWidget) return;

    // --- Floating Animation ---
    gsap.to(assistantWidget, {
        y: -10,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        duration: 5
    });

    // --- Chat Logic ---
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-chat-btn');
    const MAX_MESSAGES = 6; // Show 3 user messages and 3 bot replies

    const sendMessage = async () => {
        const input = chatInput.value.trim();
        if (input === "") return;

        // Display user message
        const userMessageEl = document.createElement('div');
        userMessageEl.className = 'chat-message user-message';
        userMessageEl.textContent = input;
        chatMessages.appendChild(userMessageEl);
        chatInput.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Manage message history
        while (chatMessages.children.length > MAX_MESSAGES) {
            chatMessages.firstChild.remove();
        }

        // Get AI response
        try {
            const response = await fetch('https://glickko-github-io.vercel.app/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            const botMessageEl = document.createElement('div');
            botMessageEl.className = 'chat-message bot-message';
            botMessageEl.textContent = data.reply;
            chatMessages.appendChild(botMessageEl);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Manage message history again after bot reply
            while (chatMessages.children.length > MAX_MESSAGES) {
                chatMessages.firstChild.remove();
            }

        } catch (error) {
            console.error('Error with chatbot:', error);
            const errorEl = document.createElement('div');
            errorEl.className = 'chat-message bot-message';
            errorEl.textContent = "Sorry, I'm having trouble connecting.";
            chatMessages.appendChild(errorEl);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    };
    
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keyup', (e) => {
        if (e.key === "Enter") sendMessage();
    });
};

const manageAIAssistantVisibility = (path) => {
    const isIndexPage = path.endsWith('/') || path.endsWith('index.html');
    const assistantWidget = document.getElementById('ai-assistant-widget');

    if (assistantWidget) {
        if (isIndexPage) {
            assistantWidget.classList.remove('hidden');
        } else {
            assistantWidget.classList.add('hidden');
        }
    }
};


const loadGuideStylesheet = () => {
    if (!document.head.querySelector('link[href="css/guide.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/guide.css';
        document.head.appendChild(link);
    }
};

const cleanupToolsGuide = () => {
    const widget = document.querySelector('.ai-guide-container');
    if (widget) {
        const intervalId = parseInt(widget.dataset.intervalId, 10);
        if (!isNaN(intervalId)) {
            clearInterval(intervalId);
        }
        widget.remove();
    }
};

const manageToolsGuide = async (path) => {
    cleanupToolsGuide();
    if (path.includes('tools.html')) {
        loadGuideStylesheet();
        try {
            const response = await fetch('js/guide_dialog.json');
            if (!response.ok) throw new Error('Could not fetch guide dialog.');
            const data = await response.json();
            const conversation = data.conversation;
            if (!conversation || conversation.length === 0) return;

            const glowColorMap = {
                'pink.png': 'hsl(330, 90%, 70%)', 'blue.png': 'hsl(210, 90%, 70%)',
                'red.png': 'hsl(0, 90%, 70%)', 'yellow.png': 'hsl(50, 90%, 70%)',
                'green.png': 'hsl(120, 90%, 70%)', 'purple.png': 'hsl(270, 90%, 70%)',
                'orange.png': 'hsl(30, 90%, 70%)', 'gray.png': 'hsl(0, 0%, 70%)'
            };

            const guideHTML = `
                <div class="ai-guide-container">
                    <div class="guide-dialog-box">
                        <p class="guide-dialog-text"></p>
                    </div>
                    <div class="guide-character-container">
                         <img src="" alt="Guide Character" class="guide-character">
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', guideHTML);

            const widget = document.querySelector('.ai-guide-container');
            const charImg = widget.querySelector('.guide-character');
            const textEl = widget.querySelector('.guide-dialog-text');
            const bubbleEl = widget.querySelector('.guide-dialog-box');
            
            let currentTurn = -1;
            const showTurn = () => {
                charImg.classList.remove('active');
                bubbleEl.classList.remove('active');

                setTimeout(() => {
                    currentTurn = (currentTurn + 1) % conversation.length;
                    const turnData = conversation[currentTurn];
                    
                    charImg.src = `float/${turnData.char}`;
                    charImg.style.setProperty('--glow-color', glowColorMap[turnData.char] || '#fff');
                    textEl.textContent = turnData.text;
                    
                    charImg.classList.add('active');
                    bubbleEl.classList.add('active');
                }, 400);
            };

            showTurn();
            const intervalId = setInterval(showTurn, 5000);
            widget.dataset.intervalId = intervalId;

        } catch (error) {
            console.error("Error setting up AI guide:", error);
        }
    }
};

const loadPortfolioConvoStylesheet = () => {
    if (!document.head.querySelector('link[href="css/portfolio_convo.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/portfolio_convo.css';
        document.head.appendChild(link);
    }
};

const cleanupPortfolioConvo = () => {
    const widget = document.getElementById('convo-widget');
    if (widget) {
        const intervalId = parseInt(widget.dataset.intervalId, 10);
        if (!isNaN(intervalId)) {
            clearInterval(intervalId);
        }
        widget.remove();
    }
};

const managePortfolioConvo = async (path) => {
    cleanupPortfolioConvo();
    if (path.includes('portfolio.html')) {
        loadPortfolioConvoStylesheet();
        try {
            const response = await fetch('js/portfolio_dialog.json');
            if (!response.ok) throw new Error('Could not fetch portfolio dialog.');
            const data = await response.json();
            const conversation = data.conversation;
            if (!conversation || conversation.length === 0) return;

            const glowColorMap = {
                'pink.png': 'hsl(330, 90%, 70%)', 'blue.png': 'hsl(210, 90%, 70%)',
                'red.png': 'hsl(0, 90%, 70%)', 'yellow.png': 'hsl(50, 90%, 70%)',
                'green.png': 'hsl(120, 90%, 70%)', 'purple.png': 'hsl(270, 90%, 70%)',
                'orange.png': 'hsl(30, 90%, 70%)', 'gray.png': 'hsl(0, 0%, 70%)'
            };

            const widgetHTML = `
                <div id="convo-widget">
                    <div class="convo-character-container">
                        <img src="" alt="Character" class="convo-character">
                    </div>
                    <div class="convo-bubble"><p class="convo-text"></p></div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', widgetHTML);

            const widget = document.getElementById('convo-widget');
            const charImg = widget.querySelector('.convo-character');
            const textEl = widget.querySelector('.convo-text');
            const bubbleEl = widget.querySelector('.convo-bubble');
            
            let currentTurn = -1;
            const showTurn = () => {
                charImg.classList.remove('active');
                bubbleEl.classList.remove('active');

                setTimeout(() => {
                    currentTurn = (currentTurn + 1) % conversation.length;
                    const turnData = conversation[currentTurn];
                    
                    charImg.src = `float/${turnData.char}`;
                    charImg.style.setProperty('--glow-color', glowColorMap[turnData.char] || '#fff');
                    textEl.textContent = turnData.text;
                    
                    charImg.classList.add('active');
                    bubbleEl.classList.add('active');
                }, 400);
            };
            
            showTurn();
            const intervalId = setInterval(showTurn, 5000);
            widget.dataset.intervalId = intervalId;

        } catch (error) {
            console.error("Failed to start portfolio conversation:", error);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');
    const navContainer = document.querySelector('nav');
    
    initializeAIAssistant();

    const initializeToolsPage = async () => {
        const toolsList = document.querySelector('.tools-list');
        const searchBar = document.getElementById('tool-search-bar');
        if (!toolsList) return;

        toolsList.innerHTML = `<p class="loading-text">Loading Tools...</p>`;

        try {
            const response = await fetch('tools.json');
            if (!response.ok) throw new Error('Network response was not ok.');
            const toolsData = await response.json();
            toolsData.sort((a, b) => a.name.localeCompare(b.name));

            const toolItemsHTML = toolsData.map(tool => {
                const tagsHTML = tool.tags.map(tag => {
                    const tagClass = `tool-tag--${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                    return `<span class="tool-tag ${tagClass}">${tag}</span>`;
                }).join('');
                return `
                    <a href="${tool.href}" target="_blank" rel="noopener noreferrer" class="tool-item">
                        <span class="tool-name">${tool.name}</span>
                        <div class="tool-tags-container">${tagsHTML}</div>
                    </a>
                `;
            }).join('');
            
            toolsList.innerHTML = toolItemsHTML;

            const toolItems = toolsList.querySelectorAll('.tool-item');
            if (searchBar) {
                searchBar.addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    toolItems.forEach(item => {
                        const name = item.querySelector('.tool-name').textContent.toLowerCase();
                        const tags = Array.from(item.querySelectorAll('.tool-tag')).map(t => t.textContent.toLowerCase());
                        const isMatch = searchTerm === '' || name.includes(searchTerm) || tags.some(tag => tag.includes(searchTerm));
                        item.classList.toggle('hidden', !isMatch);
                    });
                    toolsList.scrollTop = 0;
                });
            }
        } catch (error) {
            console.error('Failed to load tools data:', error);
            toolsList.innerHTML = `<p style="text-align:center; color: #ff5555;">Error: Could not load tools list.</p>`;
        }
    };

    const initializePortfolioPage = async () => {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        const body = document.body;
        if (!portfolioGrid) return;

        portfolioGrid.innerHTML = `<p class="loading-text">Loading Portfolio...</p>`;

        try {
            const response = await fetch('portfolio.json');
            if (!response.ok) throw new Error('Network response was not ok for portfolio.json');
            const portfolioData = await response.json();
            let portfolioItemsHTML = '';
            let modalsHTML = '';
            portfolioData.forEach(item => {
                portfolioItemsHTML += `
                    <div class="portfolio-item" data-category="${item.category}" data-modal-id="${item.id}">
                        <img src="${item.imageSrc}" alt="${item.title}">
                        <div class="overlay">
                            <div class="overlay-text">
                                <h3>${item.title}</h3>
                                <span>${item.categoryLabel}</span>
                            </div>
                        </div>
                    </div>
                `;
                modalsHTML += `
                    <div id="${item.id}" class="modal">
                        <div class="modal-content">
                            <span class="modal-close">&times;</span>
                            <div class="modal-image-container">
                                <img src="${item.imageSrc}" alt="${item.title}">
                            </div>
                            <div class="modal-text-container">
                                <h2>${item.title}</h2>
                                <p class="modal-category">${item.categoryLabel}</p>
                                <div class="modal-details">
                                    <p>${item.description}</p>
                                </div>
                                <a href="${item.projectUrl}" class="project-link-btn" target="_blank" rel="noopener noreferrer">View Project</a>
                            </div>
                        </div>
                    </div>
                `;
            });

            portfolioGrid.innerHTML = portfolioItemsHTML;
            body.insertAdjacentHTML('beforeend', modalsHTML);
            
            const filterBtns = document.querySelectorAll('.filter-btn');
            const portfolioItems = document.querySelectorAll('.portfolio-item');
            const modals = document.querySelectorAll('.modal');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const newFilter = btn.dataset.filter;
                    portfolioItems.forEach(item => {
                        item.classList.toggle('hidden', newFilter !== 'all' && item.dataset.category !== newFilter);
                    });
                });
            });
            portfolioItems.forEach(item => {
                item.addEventListener('click', () => {
                    cleanupPortfolioConvo();
                    const modalId = item.dataset.modalId;
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        modal.style.display = 'flex';
                        body.style.overflow = 'hidden';
                    }
                });
            });

            modals.forEach(modal => {
                const handleClose = () => {
                    modal.style.display = 'none';
                    body.style.overflow = 'auto';
                    managePortfolioConvo(window.location.pathname);
                };

                const closeBtn = modal.querySelector('.modal-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', handleClose);
                }

                modal.addEventListener('click', (e) => {
                    if (e.target === modal && !e.target.closest('.modal-content')) {
                        handleClose();
                    }
                });
            });
        } catch (error) {
            console.error('Failed to load portfolio data:', error);
            portfolioGrid.innerHTML = `<p style="text-align:center; color: #ff5555;">Error: Could not load portfolio.</p>`;
        }
    };

    const loadContent = async (url, pushState = true) => {
        try {
            cleanupToolsGuide();
            cleanupPortfolioConvo();
            mainContainer.classList.add('fade-out');
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok.');
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const newMainContent = doc.getElementById('main-container').innerHTML;
            const newTitle = doc.title;
            const newNavContent = doc.querySelector('nav').innerHTML;
            setTimeout(() => {
                document.querySelectorAll('.modal').forEach(modal => modal.remove());
                mainContainer.className = doc.getElementById('main-container').className;
                mainContainer.innerHTML = newMainContent;
                document.title = newTitle;
                navContainer.innerHTML = newNavContent;
                mainContainer.classList.remove('fade-out');
                mainContainer.classList.add('fade-in');
                setTimeout(() => mainContainer.classList.remove('fade-in'), 500);
                attachNavListeners();
                if (url.includes('tools.html')) initializeToolsPage();
                if (url.includes('portfolio.html')) initializePortfolioPage();
                manageAIAssistantVisibility(url);
                manageToolsGuide(url);
                managePortfolioConvo(url);
            }, 400);
            if (pushState) {
                history.pushState({ path: url }, newTitle, url);
            }
        } catch (error) {
            console.error('Failed to load page: ', error);
            mainContainer.innerHTML = `<p style="text-align:center; color: #ff5555;">Error: Could not load content.</p>`;
            mainContainer.classList.remove('fade-out');
        }
    };

    const attachNavListeners = () => {
        const navLinks = document.querySelectorAll('a.menu-item, a.home-link-icon');
        navLinks.forEach(link => {
            if (link.dataset.listenerAttached) return;
            link.dataset.listenerAttached = 'true';
            link.addEventListener('click', (e) => {
                const url = link.getAttribute('href');
                if (url && !url.startsWith('http') && !link.hasAttribute('target')) {
                    e.preventDefault();
                    loadContent(url);
                }
            });
        });
    }

    window.addEventListener('popstate', (e) => {
        const path = e.state?.path || window.location.pathname;
        loadContent(path, false);
    });

    attachNavListeners();
    const initialPath = window.location.pathname;
    mainContainer.className = document.getElementById('main-container').className;
    if (initialPath.includes('tools.html')) initializeToolsPage();
    if (initialPath.includes('portfolio.html')) initializePortfolioPage();
    manageAIAssistantVisibility(initialPath);
    manageToolsGuide(initialPath);
    managePortfolioConvo(initialPath);
});