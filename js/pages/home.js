import { $ } from '../modules/helpers.js';
import { fetchItems, renderSkeleton } from '../modules/data.js';
import { artcard } from '../modules/artCard.js';
import { isFavorite, toggleFavorite } from '../modules/favorites.js';

const main = $('main');

let page = 1;
let initialLoad = true;

export const loadHome = async () => {

    renderSkeleton(main);

    const { artObjects: items } = await fetchItems(page);
    if(!items || items.length === 0){
        renderError();
        return;
    }
    const moreresultsSection = $('main > span');

    setTimeout(() => {
        renderArtDisplay(items, true);
        initialLoad = false;
    }, 1000);

    let moreResultsOptions = {
        rootMargin: '0px 0px 300px 0px',
    }

    const moreResultsObserver = new IntersectionObserver(async (entries, observer) => {
        const entry = entries[0];
        if (entry.isIntersecting) {

            if (!initialLoad) {
                page++;
                const { artObjects: items } = await fetchItems(page);
                renderArtDisplay(items);
            }
        }
    }, moreResultsOptions);
    moreResultsObserver.observe(moreresultsSection);
}

export function renderArtDisplay(items, fresh = false) {
    const resultsContainer = $('main > ul');
    if (fresh) {
        resultsContainer.innerHTML = '';
    }

    if (items.length === 0) {
        resultsContainer.innerHTML = '<li class="loaded">There were no art pieces found</li>';
        return;
    }

    items.forEach(async item => {

        const saveButtonIcon = isFavorite(item.objectNumber) ? '❤️' : '🖤';
        await artcard({ item, saveButtonIcon, resultsContainer, observe: true });

        const lastItem = resultsContainer.lastElementChild;
        const saveButton = $('button:first-of-type', lastItem);
        saveButton.addEventListener('click', (e) => toggleFavorite(e, item.objectNumber));
    });
}

export function renderError() {
    const button = document.createElement('button');
    button.innerHTML = 'Try again 🔃';

    main.innerHTML = `
        <section>
            <p>Something went wrong while getting Art from the Rijksmuseum</p>
            ${button.outerHTML}
        </section>
    `;

    main.classList.add('error');

    const retryButton = $('button', main);
    console.log(retryButton);
    retryButton.addEventListener('click', () => {
        loadHome();
    });
}
