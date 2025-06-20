// js/app.js
document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');
    const navContainer = document.querySelector('nav');
    
    const initializeToolsPage = () => {
        const searchBar = document.getElementById('tool-search-bar');
        if (!searchBar) return;
        const toolItems = document.querySelectorAll('.tool-item');
        const toolsList = document.querySelector('.tools-list'); // Get reference to the list

        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            toolItems.forEach(item => {
                const name = item.querySelector('.tool-name').textContent.toLowerCase();
                const tag = item.querySelector('.tool-tag')?.textContent.toLowerCase() || '';
                const isMatch = searchTerm === '' || name.includes(searchTerm) || tag.includes(searchTerm);

                if (isMatch) {
                    item.classList.remove('hidden');
                    item.style.order = -1; 
                } else {
                    item.classList.add('hidden');
                    item.style.order = 1;
                }
            });

            // After filtering, scroll the list to the top
            if (toolsList) {
                toolsList.scrollTop = 0;
            }
        });
    };

    const initializePortfolioPage = () => {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        const modals = document.querySelectorAll('.modal');
        const body = document.body;

        if (!filterBtns.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const newFilter = btn.dataset.filter;

                portfolioItems.forEach(item => {
                    const shouldBeVisible = (newFilter === 'all' || item.dataset.category === newFilter);
                    
                    if (shouldBeVisible) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
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
                if (e.target === modal) {
                    modal.style.display = 'none';
                    body.style.overflow = 'auto';
                }
            });
        });
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

    attachNavListeners();
    const initialPath = window.location.pathname.split("/").pop();
    if (initialPath.includes('portfolio.html')) {
         mainContainer.classList.add('main-portfolio-layout');
         initializePortfolioPage();
    }
    if (initialPath.includes('tools.html')) initializeToolsPage();
});