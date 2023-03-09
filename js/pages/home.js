import { $, awaitMap } from '../modules/helpers.js';
import { fetchItems, renderSkeleton } from '../modules/data.js';
import { artCard } from '../modules/artCard.js';
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

export async function renderArtDisplay(items, fresh = false, showMore = false) {
    const resultsContainer = $('main > ul');
    if (fresh) {
        resultsContainer.innerHTML = '';
    }

    if (items.length === 0) {
        resultsContainer.innerHTML = `
            <li class="loaded empty-search">
                <div>
                    <p>There were no art pieces found! </p>
                    Try another search or check out the art items below
                    <span>⬇️</span>
                </div>
            </li>
        `;
        return;
    }

    await awaitMap(items.map(async (item) => {
        const saveButtonIcon = isFavorite(item.objectNumber) ? '❤️' : '🖤';
        await artCard({ item, saveButtonIcon, resultsContainer, observe: true });

        const lastItem = resultsContainer.lastElementChild;
        const saveButton = $('menu li:first-of-type button', lastItem);
        saveButton.addEventListener('click', (e) => toggleFavorite(e, item.objectNumber));
    }));

    if (showMore) {
        const moreResultsSection = document.createElement('li');
        moreResultsSection.classList.add('see-other');
        moreResultsSection.classList.add('loaded');

        moreResultsSection.innerHTML = `
        <div>
            <p>Those were the search results ✅</p>
            Check out the other items below
            <span>⬇️</span>
        </div>
        `;

        resultsContainer.appendChild(moreResultsSection);
    }
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
