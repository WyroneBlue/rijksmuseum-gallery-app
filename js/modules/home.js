import { $ } from './helpers.js';
import { fetchItems, renderSkeleton } from './data.js';
import { artcard } from './artCard.js';
import { isFavorite, toggleFavorite } from './favorites.js';

const main = $('main');

let page = 1;
let initialLoad = true;

export const loadHome = async () => {

    renderSkeleton(main);

    const { artObjects: items } = await fetchItems(page);
    const moreresultsSection = $('main > span');

    setTimeout(() => {
        renderHTML(items, true);
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
                renderHTML(items);
            }
        }
    }, moreResultsOptions);
    moreResultsObserver.observe(moreresultsSection);
}

export function renderHTML(items, fresh = false) {
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
