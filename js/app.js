// js/app.js
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

                if (url.includes('portfolio.html')) {
                    mainContainer.classList.add('main-portfolio-layout');
                } else {
                    mainContainer.classList.remove('main-portfolio-layout');
                }

                mainContainer.innerHTML = newMainContent;
                document.title = newTitle;
                navContainer.innerHTML = newNavContent;
                
                mainContainer.classList.remove('fade-out');
                mainContainer.classList.add('fade-in');

                setTimeout(() => mainContainer.classList.remove('fade-in'), 500);
                attachNavListeners();

                if (url.includes('tools.html')) initializeToolsPage();
                if (url.includes('portfolio.html')) initializePortfolioPage();

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
        if (e.state && e.state.path) {
            loadContent(e.state.path, false);
        } else {
            const currentPath = window.location.pathname.split("/").pop();
            if (currentPath.includes('portfolio.html')) initializePortfolioPage();
            if (currentPath.includes('tools.html')) initializeToolsPage();
        }
    });

    // --- INITIAL PAGE LOAD ---
    attachNavListeners();

    const initialPath = window.location.pathname.split("/").pop();
    if (initialPath.includes('portfolio.html')) {
         mainContainer.classList.add('main-portfolio-layout');
         initializePortfolioPage();
    }
    if (initialPath.includes('tools.html')) initializeToolsPage();
});