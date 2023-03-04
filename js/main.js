console.log('Hello World!');

import { $ } from './helpers.js';
import router from './router.js';
import { renderHTML } from './home.js';
import { fetchDetails, renderSkeleton, searchItems } from './data.js';
import { artcard } from './artCard.js';
import { removeFavorite, favoritesArray, showFavoritesCount, emptyState } from './favorites.js';


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

    const search = form.querySelector('label:first-of-type input').value;
    const sort = form.querySelector('fieldset input:checked').value;
    const topPiece = form.querySelector('fieldset label:first-of-type input[name="top-piece"]').checked;
    const imageOnly = form.querySelector('fieldset label:last-of-type input[name="image-only"]').checked;

    toggleFilters();

    const { artObjects: items } = await searchItems(1, search, sort, topPiece, imageOnly);

    setTimeout(() => {
        // Checken of home is en geladen dan pas card vullen
        renderHTML(items, freshLoad);
    }, 500);
});

const removeItem = (e, objectNumber) => {
    console.log('remove favorite', objectNumber);
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

        const removeButton = lastItem.querySelector('button:first-of-type');
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