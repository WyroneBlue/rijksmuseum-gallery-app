import { $ } from '../modules/helpers.js';
import { fetchDetails } from '../modules/data.js';
import { isFavorite, toggleFavorite } from '../modules/favorites.js';
import { transitionPage } from '../modules/router.js';

const main = $('main');
const dialog = $('dialog');

export const showDetails = async() => {
    renderLoading();

    const id = window.location.hash.split('/')[1];
    const { artObject: details } = await fetchDetails(id);

    setTimeout(() => {
        transitionPage(renderHTML, details);
    }, 1000);

    function renderHTML (details) {

        main.classList.remove('loading');

        const saveButtonIcon = isFavorite(details.objectNumber) ? '❤️' : '🖤';

        const url = `http://www.rijksmuseum.nl/nl/collectie/${details.objectNumber}`;

        let image = '';
        let msg = '';
        let alt = '';
        let ratio = 1;
        try {
            image = details.webImage.url;
            ratio = details.webImage.width / details.webImage.height;
            if (details.plaqueDescriptionDutch) {
                alt = details.plaqueDescriptionDutch;
            } else {
                alt = `Image for ${details.title}.`;
            }
        } catch (error) {
            image = './assets/images/explore-placeholder.jpg';
            msg = ': <span>Only available in the Rijksmuseum</span>';
            alt = `Placeholder image for ${details.title}. This image is only available in the Rijksmuseum`;
        }
        const style = `aspect-ratio: ${ratio}`;


        main.innerHTML = `
            <section>
                <nav>
                    <a href="#home">Back to home</a>
                    <a href="${url}" target="_blank">Rijksmuseum </a>
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

        const saveButton = $('button', main);
        saveButton.addEventListener('click', (e) => toggleFavorite(e, details.objectNumber));
    }

    function renderLoading () {

        main.classList.add('loading');
        main.innerHTML = `
            <h1>loading...</h1>
        `;
    }
}

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

    const detailButton = $('a:last-of-type', dialog);
    detailButton.addEventListener('click', () => {
        closeDialog();
    });

    dialog.showModal();
}

export const closeDialog = () => {
    dialog.close();
    dialog.innerHTML = '';
}

window.addEventListener('click', (e) => {
    if (e.target === dialog && dialog.open) {
        closeDialog();
    }
});
