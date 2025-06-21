// js/layout.js
document.addEventListener('DOMContentLoaded', async () => {
    try {
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

    } catch (error) {
        console.error("Error setting up layout:", error);
    }
});