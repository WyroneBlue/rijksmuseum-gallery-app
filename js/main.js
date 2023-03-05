console.log('Hello World!');

import router from './modules/router.js';
import { $ } from './modules/helpers.js';
import { fetchDetails, renderSkeleton, searchItems } from './modules/data.js';
import { artcard } from './modules/artCard.js';
import { removeFavorite, favoritesArray, showFavoritesCount, emptyState } from './modules/favorites.js';
import { renderHTML } from './pages/home.js';

const favoButton = $('footer button[aria-label="toggle-favorites"]');
const favorites = $('aside[aria-label="favorites"]');
const closeFavorites = $('aside[aria-label="favorites"] button');
const favoritesList = $('aside[aria-label="favorites"] ul');

const form = $('aside form');
const filterButton = $('footer button[aria-label="toggle-filters"]');
const filters = $('aside[aria-label="filters"]');
const closeFilters = $('aside[aria-label="filters"] button');

favoButton.addEventListener('click', toggleFavorites);
filterButton.addEventListener('click', toggleFilters);

closeFilters.addEventListener('click', toggleFilters);
closeFavorites.addEventListener('click', toggleFavorites);

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let freshLoad = true;
    if (window.location.hash !== '#home' && window.location.hash !== '') {
        freshLoad = false;
        window.location = '#home';
    }

    const search = $('label:first-of-type input', form).value;
    const sort = $('fieldset input:checked', form).value;
    const topPiece = $('fieldset label:first-of-type input[name="top-piece"]', form).checked;
    const imageOnly = $('fieldset label:last-of-type input[name="image-only"]', form).checked;

    toggleFilters();

    const { artObjects: items } = await searchItems(1, search, sort, topPiece, imageOnly);

    setTimeout(() => {
        // Checken of home is en geladen dan pas card vullen
        renderHTML(items, freshLoad);
    }, 500);
});

const removeItem = (e, objectNumber) => {
    const confirmRemove = confirm('Are you sure you want to remove this item from your favorites?');

    if (confirmRemove) {
        removeFavorite(objectNumber);
        e.target.closest('li').remove();
        const count = showFavoritesCount();
        if (count === 0) {
            emptyState(favoritesList);
        }
    }
}

const loadFavorites = async () => {
    const count = showFavoritesCount();
    if (count === 0) {
        emptyState(favoritesList);
        return
    }

    renderSkeleton(favoritesList, false);

    const items = await Promise.all(favoritesArray.map(async (id) => {
        const { artObject: item } = await fetchDetails(id);
        return item;
    }));
    favoritesList.innerHTML = '';

    items.forEach(async item => {
        const saveButtonIcon = "❌";
        await artcard({ item, saveButtonIcon, observe: true, resultsContainer: favoritesList });

        const lastItem = favoritesList.lastElementChild;

        const removeButton = $('button:first-of-type', lastItem);
        removeButton.addEventListener('click', (e) => removeItem(e, item.objectNumber));
    });
}

export async function toggleFavorites (){

    if(filters.classList.contains('show')) {
        toggleFilters();
    }
    favorites.classList.toggle('show');

    if(favorites.classList.contains('show')) {
        loadFavorites();
    }
}

export function toggleFilters (){

    if(favorites.classList.contains('show')) {
        toggleFavorites();
    }
    filters.classList.toggle('show');
}

export function closeWindows () {
    if(filters.classList.contains('show')) {
        toggleFilters();
    }
    if(favorites.classList.contains('show')) {
        toggleFavorites();
    }
}

router();