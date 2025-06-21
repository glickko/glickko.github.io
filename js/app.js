// js/app.js

const manageFloatingAssets = async (path) => {
    const existingContainer = document.querySelector('.floating-asset-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    const isIndexPage = path.endsWith('/') || path.endsWith('index.html');
    if (isIndexPage) {
        try {
            const response = await fetch('dialog.json');
            if (!response.ok) throw new Error('Failed to fetch dialog.json');
            const dialogsByFile = await response.json();
            const assetSources = [
                'float/pink.png', 'float/blue.png', 'float/red.png',
                'float/yellow.png', 'float/green.png', 'float/purple.png', 'float/orange.png',
                'float/gray.png'
            ];
            const colorMap = {
                'pink.png': 'hsl(330, 90%, 70%)', 'blue.png': 'hsl(210, 90%, 70%)',
                'red.png': 'hsl(0, 90%, 70%)', 'yellow.png': 'hsl(50, 90%, 70%)',
                'green.png': 'hsl(120, 90%, 70%)', 'purple.png': 'hsl(270, 90%, 70%)',
                'orange.png': 'hsl(30, 90%, 70%)',
                'gray.png': 'hsl(0, 0%, 70%)'
            };
            const gridCells = [
                { top: [5, 20], left: [5, 20] },   { top: [5, 20], left: [40, 55] },  { top: [5, 20], left: [75, 90] },
                { top: [35, 50], left: [15, 30] }, { top: [35, 50], left: [65, 80] },
                { top: [65, 80], left: [5, 20] },   { top: [65, 80], left: [40, 55] },  { top: [65, 80], left: [75, 90] },
            ];
            for (let i = gridCells.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [gridCells[i], gridCells[j]] = [gridCells[j], gridCells[i]];
            }
            const floatingAssetsHTML = assetSources.map((src, index) => {
                const filename = src.split('/').pop();
                const glowColor = colorMap[filename] || '#fff';
                const cell = gridCells[index % gridCells.length];
                const randomTop = Math.random() * (cell.top[1] - cell.top[0]) + cell.top[0];
                const randomLeft = Math.random() * (cell.left[1] - cell.left[0]) + cell.left[0];
                const randomDuration = Math.random() * 15 + 15;
                const randomDelay = Math.random() * 5;
                return `
                    <div class="floating-asset-wrapper" 
                         data-filename="${filename}" 
                         style="top: ${randomTop}%; left: ${randomLeft}%; animation-duration: ${randomDuration}s; animation-delay: ${randomDelay}s;">
                        <img src="${src}" class="floating-asset-image" alt="Floating Asset" style="--glow-color: ${glowColor};">
                        <span class="asset-label"></span>
                    </div>
                `;
            }).join('');
            const floatingAssetContainerHTML = `<div class="floating-asset-container">${floatingAssetsHTML}</div>`;
            document.body.insertAdjacentHTML('afterbegin', floatingAssetContainerHTML);
            const assetWrappers = document.querySelectorAll('.floating-asset-wrapper');
            const dialogTrackers = {};
            assetWrappers.forEach(wrapper => {
                const label = wrapper.querySelector('.asset-label');
                const filename = wrapper.dataset.filename;
                const dialogList = dialogsByFile[filename];
                if (!label || !dialogList || dialogList.length === 0) return;
                dialogTrackers[filename] = { currentIndex: 0 };
                const updateLabelSequentially = () => {
                    const tracker = dialogTrackers[filename];
                    const dialogText = dialogList[tracker.currentIndex];
                    label.textContent = dialogText;
                    tracker.currentIndex = (tracker.currentIndex + 1) % dialogList.length;
                };
                updateLabelSequentially();
                setInterval(updateLabelSequentially, Math.random() * 2000 + 3000);
            });
        } catch (error) {
            console.error("Error setting up floating assets:", error);
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
            const dialogData = await response.json();
            const steps = dialogData.steps;
            if (!steps || steps.length === 0) return;

            const guideHTML = `
                <div class="ai-guide-container">
                    <div class="guide-dialog-box">
                        <p class="guide-dialog-text"></p>
                    </div>
                    <div class="guide-character-container">
                         <img src="float/pink.png" alt="Guide Character" class="guide-character">
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', guideHTML);

            const widget = document.querySelector('.ai-guide-container');
            const textEl = widget.querySelector('.guide-dialog-text');
            const charImg = widget.querySelector('.guide-character');
            
            charImg.classList.add('active');
            
            let currentStep = -1;
            const showNextStep = () => {
                currentStep = (currentStep + 1) % steps.length;
                textEl.style.opacity = 0;
                setTimeout(() => {
                    textEl.textContent = steps[currentStep];
                    textEl.style.opacity = 1;
                }, 300);
            };

            showNextStep();
            const intervalId = setInterval(showNextStep, 6000);
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
                    <img src="" alt="Character" class="convo-character">
                    <div class="convo-bubble"><p class="convo-text"></p></div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', widgetHTML);

            const widget = document.getElementById('convo-widget');
            const charImg = widget.querySelector('.convo-character');
            const textEl = widget.querySelector('.convo-text');
            
            let currentTurn = -1;
            const showTurn = () => {
                charImg.classList.remove('active');
                setTimeout(() => {
                    currentTurn = (currentTurn + 1) % conversation.length;
                    const turnData = conversation[currentTurn];
                    
                    charImg.src = `float/${turnData.char}`;
                    charImg.style.setProperty('--glow-color', glowColorMap[turnData.char] || '#fff');
                    textEl.textContent = turnData.text;
                    
                    charImg.classList.add('active');
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
    
    const initializeToolsPage = async () => {
        const toolsList = document.querySelector('.tools-list');
        const searchBar = document.getElementById('tool-search-bar');
        if (!toolsList) return;
        try {
            const response = await fetch('tools.json');
            if (!response.ok) throw new Error('Network response was not ok.');
            const toolsData = await response.json();
            toolsData.sort((a, b) => a.name.localeCompare(b.name));
            toolsList.innerHTML = toolsData.map(tool => {
                const tagsHTML = tool.tags.map(tag => `<span class="tool-tag">${tag}</span>`).join('');
                return `
                    <a href="${tool.href}" target="_blank" rel="noopener noreferrer" class="tool-item">
                        <span class="tool-name">${tool.name}</span>
                        <div class="tool-tags-container">${tagsHTML}</div>
                    </a>
                `;
            }).join('');
            const toolItems = toolsList.querySelectorAll('.tool-item');
            if (searchBar) {
                searchBar.addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    toolItems.forEach(item => {
                        const name = item.querySelector('.tool-name').textContent.toLowerCase();
                        const tags = Array.from(item.querySelectorAll('.tool-tag')).map(t => t.textContent.toLowerCase());
                        const isMatch = searchTerm === '' || name.includes(searchTerm) || tags.some(tag => tag.includes(searchTerm));
                        if (isMatch) {
                            item.classList.remove('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
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
                const closeBtn = modal.querySelector('.modal-close');
                closeBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                    body.style.overflow = 'auto';
                });
                modal.addEventListener('click', (e) => {
                    if (e.target === modal && !e.target.closest('.modal-content')) {
                        modal.style.display = 'none';
                        body.style.overflow = 'auto';
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
                mainContainer.classList.toggle('main-portfolio-layout', url.includes('portfolio.html'));
                mainContainer.innerHTML = newMainContent;
                document.title = newTitle;
                navContainer.innerHTML = newNavContent;
                mainContainer.classList.remove('fade-out');
                mainContainer.classList.add('fade-in');
                setTimeout(() => mainContainer.classList.remove('fade-in'), 500);
                attachNavListeners();
                if (url.includes('tools.html')) initializeToolsPage();
                if (url.includes('portfolio.html')) initializePortfolioPage();
                manageFloatingAssets(url);
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
    if (initialPath.includes('portfolio.html')) {
         mainContainer.classList.add('main-portfolio-layout');
         initializePortfolioPage();
    }
    if (initialPath.includes('tools.html')) initializeToolsPage();
    manageFloatingAssets(initialPath);
    manageToolsGuide(initialPath);
    managePortfolioConvo(initialPath);
});