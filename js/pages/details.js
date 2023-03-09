import { $ } from '../modules/helpers.js';
import { fetchDetails } from '../modules/data.js';
import { isFavorite, toggleFavorite } from '../modules/favorites.js';
import { transitionPage } from '../modules/router.js';

const main = $('main');
const dialog = $('dialog');

// show details page
export const showDetails = async() => {

    // activate loading screen
    renderLoading();

    // Get details from API
    const id = window.location.hash.split('/')[1];
    const { artObject: details } = await fetchDetails(id);

    // Show details with transition
    setTimeout(() => {
        transitionPage(renderHTML, details);
    }, 1000);

    // render details
    function renderHTML (details) {

        // Remove loading screen
        main.classList.remove('loading');

        // Set save button icon
        const saveButtonIcon = isFavorite(details.objectNumber) ? '❤️' : '🖤';


        const external_link = `http://www.rijksmuseum.nl/nl/collectie/${details.objectNumber}`;

        // Set image and alt text
        let image = '';
        let msg = '';
        let alt = '';
        let ratio = 1;

        // Check if image is available
        try {
            image = details.webImage.url;
            ratio = details.webImage.width / details.webImage.height;
            if (details.plaqueDescriptionDutch) {
                alt = details.plaqueDescriptionDutch;
            } else {
                alt = `Image for ${details.title}.`;
            }
        } catch (error) { // If not, show placeholder image
            image = './assets/images/explore-placeholder.jpg';
            msg = ': <span>Only available in the Rijksmuseum</span>';
            alt = `Placeholder image for ${details.title}. This image is only available in the Rijksmuseum`;
        }

        // Set aspect ratio
        const style = `aspect-ratio: ${ratio}`;

        // Render HTML
        main.innerHTML = `
            <section>
                <nav>
                    <a href="#home">Back to home</a>
                    <a href="${external_link}" target="_blank">Rijksmuseum </a>
                </nav>
                <article>
                    <h1 tabIndex="0">${details.title}${msg}</h1>
                    <div style="${style}">
                        <img tabIndex="0" src="${image}" alt="${alt}">
                        <p>${details.longTitle}</p>
                        <button>${saveButtonIcon}</button>
                    </div>
                </article>
            </section>
        `;

        // Add event listeners
        const saveButton = $('button', main);
        saveButton.addEventListener('click', (e) => toggleFavorite(e, details.objectNumber));
    }

    // Show loading screen
    function renderLoading () {

        main.classList.add('loading');
        main.innerHTML = `
            <h1>loading...</h1>
        `;
    }
}

// Show extra info in dialog
export const showInfo = (e, item) => {

    dialog.innerHTML = `
        <div>
            <h1>Extra info</h1>
            <form method="dialog">
                <button type="submit">❌</button>
            </form>
        </div>

        <section>
            <h2>${item.title}</h2>
            <p>${item.longTitle}</p>
        </section>

        <div>
            <a href="${item.links.web}" target="_blank">Bekijk op rijksmuseum</a>
            <a href="#details/${item.objectNumber}">
                Bekijk detail pagina
            </a>
        </div>
    `;

    // Add event listeners for closing dialog
    const detailButton = $('a:last-of-type', dialog);
    detailButton.addEventListener('click', () => {
        closeDialog();
    });

    dialog.showModal();
}

// Close dialog function
export const closeDialog = () => {
    dialog.close();
    dialog.innerHTML = '';
}

// Close dialog on click outside
window.addEventListener('click', (e) => {
    if (e.target === dialog && dialog.open) {
        closeDialog();
    }
});
