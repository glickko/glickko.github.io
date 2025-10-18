// js/app.js
// [SALIN SEMUA INI, TIMPA FILE LAMA ANDA]
// VERSI: Hanya tampil di Homepage

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
                return `
                    <div class="floating-asset-wrapper" 
                         data-filename="${filename}" 
                         style="top: ${randomTop}%; left: ${randomLeft}%;">
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
                dialogTrackers[filename] = { currentIndex: 0, intervalId: null };
                const updateLabelSequentially = () => {
                    const tracker = dialogTrackers[filename];
                    const dialogText = dialogList[tracker.currentIndex];
                    label.textContent = dialogText;
                    tracker.currentIndex = (tracker.currentIndex + 1) % dialogList.length;
                };
                updateLabelSequentially();
                dialogTrackers[filename].intervalId = setInterval(updateLabelSequentially, 4000);
            });

            let currentAssetIndex = 0;
            const showNextAsset = () => {
                assetWrappers.forEach(wrapper => wrapper.classList.remove('active'));
                if (assetWrappers.length > 0) {
                    assetWrappers[currentAssetIndex].classList.add('active');
                    currentAssetIndex = (currentAssetIndex + 1) % assetWrappers.length;
                }
            };

            if (assetWrappers.length > 0) {
                showNextAsset();
                setInterval(showNextAsset, 5000); 
            }

        } catch (error) {
            console.error("Error setting up floating assets:", error);
        }
    }
};

const initializePerCharacterGlitch = () => {
    const glitchButton = document.querySelector('.glitch-button');
    if (!glitchButton) return;

    const textContainer = glitchButton.querySelector('.text');
    const text = glitchButton.dataset.text;
    
    const fonts = ["'Orbitron', sans-serif", "'Rajdhani', sans-serif", "'Audiowide', sans-serif", "'Bruno Ace SC', sans-serif"];
    const glitchChars = ['█', '▓', '▒', '░', '§', '¶', '•', '·', '▼', '▲', '◆', '▰', '▱', '▚', '▞', '▙', '▟', '▜', '▝', '▘', '▗', '▖', 'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ'];

    if (textContainer && text) {
        textContainer.innerHTML = ''; // Clear existing text
        text.split('').forEach((char, index) => {
            const charSpan = document.createElement('span');
            charSpan.textContent = char;
            charSpan.style.setProperty('--i', index);
            charSpan.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
            
            if (char.trim() !== '') {
                setInterval(() => {
                    if (Math.random() > 0.95) { // 5% chance to glitch each interval
                        const originalChar = char;
                        charSpan.textContent = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                        setTimeout(() => {
                            charSpan.textContent = originalChar;
                        }, 100);
                    }
                }, 200);
            } else {
                 charSpan.style.width = '0.5em';
            }

            textContainer.appendChild(charSpan);
        });
    }
    
    // Destroy effect on click/touch
    const startDestroy = (e) => {
        e.preventDefault();
        glitchButton.classList.add('destroying');
    };
    
    const endDestroy = () => {
        glitchButton.classList.remove('destroying');
    };

    glitchButton.addEventListener('mousedown', startDestroy);
    glitchButton.addEventListener('touchstart', startDestroy, { passive: true });
    glitchButton.addEventListener('mouseup', endDestroy);
    glitchButton.addEventListener('mouseleave', endDestroy);
    glitchButton.addEventListener('touchend', endDestroy);
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

// ▼▼▼ FUNGSI SHOUTBOX (DENGAN LOGIKA TOGGLE & CEK HOMEPAGE) ▼▼▼
const initializeShoutbox = () => {

    // ▼▼▼ KONDISI BARU: HANYA JALANKAN DI HOMEPAGE ▼▼▼
    const currentPath = window.location.pathname;
    const isHomepage = currentPath.endsWith('/') || currentPath.endsWith('index.html') || currentPath === '';
    
    if (!isHomepage) {
        // Jika bukan homepage, jangan lakukan apa-apa
        // Hapus juga elemen shoutbox jika ada (untuk SPA)
        const existingContainer = document.getElementById('xyz-shoutbox-container');
        if (existingContainer) existingContainer.remove();
        return; 
    }
    // ▲▲▲ AKHIR KONDISI HOMEPAGE ▲▲▲

    // Cek jika elemen sudah ada (mungkin karena SPA reload cepat)
    if (document.getElementById('xyz-shoutbox-container')) {
        // Kontainer sudah ada, ambil elemennya saja
        const shoutboxContainer = document.getElementById('xyz-shoutbox-container');
        const toggleButton = document.getElementById('xyz-shoutbox-toggle');

        // Pastikan event listener toggle hanya ditambahkan sekali
        if (toggleButton && !toggleButton.dataset.listenerAttached) {
             toggleButton.addEventListener('click', () => {
                shoutboxContainer.classList.toggle('expanded');
             });
             toggleButton.dataset.listenerAttached = 'true'; // Tandai sudah ada listener
        }
        // Jika sudah ada, jangan inisialisasi Firebase lagi
        return; 
    }

    // --- Jika belum ada, buat elemen HTML dan inisialisasi Firebase ---
    
    // Buat HTML untuk widget shoutbox (jika belum ada)
    const shoutboxHTML = `
        <div id="xyz-shoutbox-container">
            <div id="xyz-shoutbox-widget">
                <div id="shoutbox-messages">
                    <p id="shoutbox-loading">Connecting to XYZ Hub...</p>
                </div>
                <form id="shoutbox-form">
                    <input type="text" id="shoutbox-input" placeholder="Connecting..." maxlength="300" disabled>
                    <button type="submit" id="shoutbox-send" disabled>SEND</button>
                </form>
            </div>
            <button id="xyz-shoutbox-toggle" aria-label="Toggle Shoutbox">
                <i class="fa-solid fa-comments icon-open"></i>
                <i class="fa-solid fa-xmark icon-close"></i>
            </button>
        </div>
    `;
    // Tambahkan HTML ke body
    document.body.insertAdjacentHTML('beforeend', shoutboxHTML);

    // --- Ambil elemen yang baru ditambahkan ---
    const shoutboxContainer = document.getElementById('xyz-shoutbox-container');
    const toggleButton = document.getElementById('xyz-shoutbox-toggle');

    // KONFIGURASI FIREBASE ANDA
    const firebaseConfig = {
        apiKey: "AIzaSyDTSNHTgMOF3Mt1ANdX0zHWmtFWxf2Hg",
        authDomain: "glickko-shoutbox.firebaseapp.com",
        databaseURL: "https://glickko-shoutbox-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "glickko-shoutbox",
        storageBucket: "glickko-shoutbox.appspot.com",
        messagingSenderId: "705260113061",
        appId: "1:705260113061:web:2d7f614916bc45e974114c",
        measurementId: "G-S1GR3TGC87"
    };

    // Inisialisasi Aplikasi Firebase
    let app;
    // Cek lagi karena mungkin sudah diinisialisasi di load sebelumnya
    if (!firebase.apps.length) { 
        app = firebase.initializeApp(firebaseConfig);
    } else {
        app = firebase.app();
    }
    
    const auth = firebase.auth();
    const database = firebase.database();
    const messagesRef = database.ref('messages');

    // Ambil Elemen DOM Internal
    const messagesBox = document.getElementById('shoutbox-messages');
    const loadingText = document.getElementById('shoutbox-loading');
    const messageForm = document.getElementById('shoutbox-form');
    const messageInput = document.getElementById('shoutbox-input');
    const sendButton = document.getElementById('shoutbox-send');

    // ▼▼▼ LOGIKA TOGGLE BARU ▼▼▼
    if (toggleButton && !toggleButton.dataset.listenerAttached) {
        toggleButton.addEventListener('click', () => {
            shoutboxContainer.classList.toggle('expanded');
        });
        toggleButton.dataset.listenerAttached = 'true'; // Tandai sudah ada listener
    }

    // Otentikasi Anonim
    const signIn = async () => {
        try {
            // Coba sign in hanya jika belum ada user
            if (!auth.currentUser) { 
                await auth.signInAnonymously();
                console.log('XYZ Hub: Signed in anonymously.', auth.currentUser.uid);
            } else {
                 console.log('XYZ Hub: Already signed in.', auth.currentUser.uid);
            }
            messageInput.disabled = false;
            sendButton.disabled = false;
            messageInput.placeholder = "Type your anonymous message...";
            listenForMessages();
        } catch (error) {
            console.error("XYZ Hub: Anonymous sign-in failed.", error);
            if (loadingText) loadingText.textContent = "Error: Could not connect to chat hub.";
        }
    };

    // Mengirim Pesan
    const sendMessage = async (e) => {
        e.preventDefault();
        const content = messageInput.value.trim();
        
        if (content.length > 0 && auth.currentUser) {
            const message = {
                content: content,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };
            try {
                await messagesRef.push(message);
                messageInput.value = '';
            } catch (error) {
                console.error("XYZ Hub: Failed to send message.", error);
            }
        }
    };

    // Mendengarkan Pesan (Real-time)
    const listenForMessages = () => {
        // Hapus listener lama jika ada (penting untuk SPA)
        messagesRef.limitToLast(100).off(); 
        
        messagesRef.limitToLast(100).on('child_added', (snapshot) => {
            if (loadingText && loadingText.style.display !== 'none') {
                loadingText.style.display = 'none';
            }
            const message = snapshot.val();
            if (message && message.content) {
                const messageElement = document.createElement('p');
                messageElement.textContent = message.content;
                messageElement.style.cssText = "color: #e0e0e0; margin: 0 0 8px 0; padding: 6px 10px; background: rgba(255,255,255,0.05); border-radius: 6px; word-wrap: break-word;";
                messagesBox.prepend(messageElement);
            }
        });
    };

    // Jalankan Modul
    messageForm.addEventListener('submit', sendMessage);
    signIn();
};
// ▲▲▲ AKHIR FUNGSI SHOUTBOX ▲▲▲


document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');
    const navContainer = document.querySelector('nav');
    
    const initializeToolsPage = async () => {
        // ... (kode initializeToolsPage tidak berubah) ...
        const toolsList = document.querySelector('.tools-list');
        const searchBar = document.getElementById('tool-search-bar');
        const lastUpdatedContainer = document.getElementById('last-updated-container');
        if (!toolsList) return;
        toolsList.innerHTML = `<p class="loading-text">Loading Tools...</p>`;
        try {
            const response = await fetch('tools.json');
            if (!response.ok) throw new Error('Network response was not ok.');
            const data = await response.json();
            const toolsData = data.tools;
            toolsData.sort((a, b) => a.name.localeCompare(b.name));
            if (lastUpdatedContainer && data.lastUpdated) {
                lastUpdatedContainer.textContent = `Glickko Last Recycle AT ${data.lastUpdated}`;
            }
            const toolItemsHTML = toolsData.map(tool => {
                const tagsHTML = tool.tags.map(tag => `<span class="tool-tag">${tag}</span>`).join('');
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
        // ... (kode initializePortfolioPage tidak berubah) ...
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
            
            // ▼▼▼ HAPUS SHOUTBOX LAMA SEBELUM LOAD ▼▼▼
            const shoutboxWidget = document.getElementById('xyz-shoutbox-container');
            if (shoutboxWidget && !(url.endsWith('/') || url.endsWith('index.html'))) {
                 shoutboxWidget.remove();
            }
            // ▲▲▲ AKHIR PENGHAPUSAN ▲▲▲

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
                
                // ▼▼▼ INISIALISASI ULANG SHOUTBOX HANYA JIKA HOMEPAGE ▼▼▼
                const currentPathAfterLoad = window.location.pathname;
                 const isHomepageAfterLoad = currentPathAfterLoad.endsWith('/') || currentPathAfterLoad.endsWith('index.html') || currentPathAfterLoad === '';
                 if (isHomepageAfterLoad) {
                     initializeShoutbox(); 
                 }
                // ▲▲▲ AKHIR INISIALISASI ULANG ▲▲▲

                initializePerCharacterGlitch();
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
    
    // ▼▼▼ PEMANGGILAN UNTUK PEMUATAN AWAL (SEKALI SAJA) ▼▼▼
    initializePerCharacterGlitch(); // Initial load
    initializeShoutbox(); // Initial load (akan cek jika homepage)
});