// js/layout.js
document.addEventListener('DOMContentLoaded', () => {
    // Array of the unique asset source files.
    const assetSources = [
        'float/pink.png',
        'float/blue.png',
        'float/red.png',
        'float/yellow.png',
        'float/green.png',
        'float/purple.png',
        'float/orange.png'
    ];

    // A map to link asset filenames to their corresponding glow colors.
    const colorMap = {
        'pink.png': 'hsl(330, 90%, 70%)',
        'blue.png': 'hsl(210, 90%, 70%)',
        'red.png': 'hsl(0, 90%, 70%)',
        'yellow.png': 'hsl(50, 90%, 70%)',
        'green.png': 'hsl(120, 90%, 70%)',
        'purple.png': 'hsl(270, 90%, 70%)',
        'orange.png': 'hsl(30, 90%, 70%)'
    };

    // Dynamically create the HTML for the floating assets.
    const floatingAssetsHTML = assetSources.map((src, index) => {
        const filename = src.split('/').pop(); // Extracts 'pink.png' from 'float/pink.png'
        const glowColor = colorMap[filename] || '#fff'; // Get color from map or use white as default
        
        const img = document.createElement('img');
        img.src = src;
        img.alt = "Floating Asset";
        img.className = `floating-asset asset-${index + 1}`;
        img.style.setProperty('--glow-color', glowColor);

        return img.outerHTML;
    }).join('');

    // Create the HTML for the background and floating assets containers.
    const backgroundAndAssetsContainerHTML = `
        <div class="bg-container">
            <div class="glitch-overlay"></div>
            <div class="pulse-container">
                <div class="pulse top-left"></div>
                <div class="pulse top-right"></div>
                <div class="pulse bottom-left"></div>
                <div class="pulse bottom-right"></div>
                <div class="dimensional-bg"></div>
            </div>
        </div>
        <div class="floating-asset-container">
            ${floatingAssetsHTML}
        </div>
    `;

    // Create the HTML for the footer.
    const footerHTML = `
        <footer>
            &copy; 2025 Glickko
        </footer>
    `;

    // Inject the elements into the current page.
    document.body.insertAdjacentHTML('afterbegin', backgroundAndAssetsContainerHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);
});