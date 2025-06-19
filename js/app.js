// js/app.js
document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');
    const navContainer = document.querySelector('nav');
    
    // Function to initialize the tools page features
    const initializeToolsPage = () => {
        const searchBar = document.getElementById('tool-search-bar');
        const toolItems = document.querySelectorAll('.tool-item');

        if (!searchBar) return; // Exit if not on the tools page

        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            toolItems.forEach(item => {
                const name = item.querySelector('.tool-name').textContent.toLowerCase();
                const tag = item.querySelector('.tool-tag')?.textContent.toLowerCase() || '';
                
                const isMatch = name.includes(searchTerm) || tag.includes(searchTerm);
                
                if (isMatch) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    };

    // --- MAIN SPA NAVIGATION LOGIC ---
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
                mainContainer.innerHTML = newMainContent;
                document.title = newTitle;
                navContainer.innerHTML = newNavContent;
                
                mainContainer.classList.remove('fade-out');
                mainContainer.classList.add('fade-in');

                setTimeout(() => mainContainer.classList.remove('fade-in'), 500);

                attachNavListeners();

                // Initialize page-specific scripts after content is loaded
                if (url.includes('tools.html')) {
                    initializeToolsPage();
                }

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
        const navLinks = document.querySelectorAll('a.menu-item, a.back-to-home');
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
            loadContent('index.html', false);
        }
    });

    // Initial attachment of listeners
    attachNavListeners();
});
