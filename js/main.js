console.log('Hello World!');

import router from './modules/router.js';
import { $, $$, awaitMap } from './modules/helpers.js';
import { fetchDetails, renderSkeleton, searchItems } from './modules/data.js';
import { artCard } from './modules/artCard.js';
import { removeFavorite, favoritesArray, showFavoritesCount, emptyState } from './modules/favorites.js';
import { renderArtDisplay } from './pages/home.js';

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

// Get values from form and search for items
const searhArt = async (e) => {
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

    const resultsContainer = $('main > ul');
    renderSkeleton(resultsContainer, false);

    const { artObjects: items } = await searchItems(1, search, sort, topPiece, imageOnly);

    setTimeout(() => {
        renderArtDisplay(items, freshLoad, true);
    }, 2000);
}

// remove item from favorites
const removeItem = (e, objectNumber) => {
    const confirmRemove = confirm('Are you sure you want to remove this item from your favorites?');

    if (confirmRemove) {
        removeFavorite(objectNumber);
        e.target.closest('li.loaded').remove();
        const count = showFavoritesCount();
        if (count === 0) {
            emptyState(favoritesList);
        }
    }
}

// load favorites from local storage
const loadFavorites = async () => {
    const count = showFavoritesCount();
    if (count === 0) {
        emptyState(favoritesList);
        return
    }

    // activate loading screen/skeleton
    renderSkeleton(favoritesList, false);

    // Fetch details for each item
    const items = await awaitMap(favoritesArray.map(async (id) => {
        const { artObject: item } = await fetchDetails(id);
        return item;
    }));
    favoritesList.innerHTML = '';

    // Render each item
    await awaitMap(items.map(async item => {
        const saveButtonIcon = "❌";
        await artCard({ item, saveButtonIcon, observe: true, resultsContainer: favoritesList });

        const lastItem = favoritesList.lastElementChild;

        const removeButton = $('button:first-of-type', lastItem);
        removeButton.addEventListener('click', (e) => removeItem(e, item.objectNumber));
    }));
}

// toggle favorites window
export async function toggleFavorites (){

    if(filters.classList.contains('show')) {
        toggleFilters();
    }
    favorites.classList.toggle('show');

    if(favorites.classList.contains('show')) {
        await loadFavorites();
        if (favoritesArray.length > 0){

            const firstItem = $('[tabindex]', favoritesList);
            firstItem.focus();
        }
        document.addEventListener('keydown', closeOnEscape);
    } else {
        favoritesList.innerHTML = '';
        document.removeEventListener('keydown', closeOnEscape);
    }
}

// toggle filters window
export function toggleFilters (){

    if(favorites.classList.contains('show')) {
        toggleFavorites();
    }
    filters.classList.toggle('show');

    if(filters.classList.contains('show')) {
        const items = $$('[tabindex]', filters);
        setTabindex(items, 0);
        items[1].focus();

        document.addEventListener('keydown', closeOnEscape);
    } else {
        const items = $$('[tabindex]', filters);
        setTabindex(items, -1);
        document.removeEventListener('keydown', closeOnEscape);
    }
}

// close filters and favorites window
export function closeWindows () {
    if(filters.classList.contains('show')) {
        toggleFilters();
    }
    if(favorites.classList.contains('show')) {
        toggleFavorites();
    }
}

// close windows on escape key
function closeOnEscape(e) {
    if (e.key === "Escape") {
        closeWindows();
    }
}

// set tabindex for items for accessibility
function setTabindex(items, value) {
    items.forEach(item => {
        item.setAttribute('tabindex', value);
    });
}

form.addEventListener('submit', searhArt);

// Start the router
router();