// js/layout.js
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // --- Global Layout Elements (Background & Footer) ---
        const backgroundHTML = `
            <div class="bg-container">
                <div class="glitch-overlay"></div>
                <div class="pulse-container">
                    <div class="pulse top-left"></div> <div class="pulse top-right"></div>
                    <div class="pulse bottom-left"></div> <div class="pulse bottom-right"></div>
                    <div class="dimensional-bg"></div>
                </div>
            </div>
        `;
        const footerHTML = `<footer>&copy; 2025 Glickko</footer>`;
        document.body.insertAdjacentHTML('afterbegin', backgroundHTML);
        document.body.insertAdjacentHTML('beforeend', footerHTML);

        // --- Floating Assets Logic (INDEX PAGE ONLY) ---
        const isIndexPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
        if (isIndexPage) {
            const [dialogResponse] = await Promise.all([
                fetch('dialog.json')
            ]);

            if (!dialogResponse.ok) throw new Error('Failed to fetch dialog.json');
            
            const dialogsByFile = await dialogResponse.json();

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

            // Object to track the current dialog index for each asset
            const dialogTrackers = {};

            assetWrappers.forEach(wrapper => {
                const label = wrapper.querySelector('.asset-label');
                const filename = wrapper.dataset.filename;
                const dialogList = dialogsByFile[filename];

                if (!label || !dialogList || dialogList.length === 0) return;
                
                // Initialize a tracker for this asset
                dialogTrackers[filename] = { currentIndex: 0 };

                const updateLabelSequentially = () => {
                    const tracker = dialogTrackers[filename];
                    const dialogText = dialogList[tracker.currentIndex];
                    
                    label.textContent = dialogText;

                    // Move to the next index, looping back to the start if necessary
                    tracker.currentIndex = (tracker.currentIndex + 1) % dialogList.length;
                };
                
                // Set initial text
                updateLabelSequentially();
                
                // Set an interval to change the text sequentially
                setInterval(() => {
                    updateLabelSequentially();
                }, Math.random() * 2000 + 3000); // Change every 3-5 seconds
            });
        }
    } catch (error) {
        console.error("Error setting up layout:", error);
    }
});