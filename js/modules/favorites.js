import { $ } from './helpers.js';

// Favorites from local storage
const favorites = localStorage.getItem('favorites');
export const favoritesArray = favorites ? JSON.parse(favorites) : [];

// Check if item is in favorites
export const isFavorite = (objectNumber) => favoritesArray.some(id => id === objectNumber);

// Show empty state in given container
export const emptyState = (list) => {
    list.innerHTML = '<p>There are no favorites yet.</p>';
}

// Show favorites count in favorites button
export const showFavoritesCount = () => {
    const favoritesCount = $('aside[aria-label="favorites"] h2 span');
    favoritesCount.innerHTML = favoritesArray.length;

    return favoritesArray.length;
}

// Toggle favorite animation
export const showFavoriteAnimation = (el, className, icon) => {
    el.classList.add(className);
    el.addEventListener('animationend', () => {
        el.classList.remove(className);
        el.innerHTML = icon;
    });
}

// Toggle favorite
export const toggleFavorite = (e, objectNumber) => {

    const favoButton = e.target;
    if (isFavorite(objectNumber)) {

        removeFavorite(objectNumber);
        showFavoriteAnimation(favoButton, 'removed', '🖤');
    } else {

        addFavorite(objectNumber);
        showFavoriteAnimation(favoButton, 'saved', '❤️');
    }
    saveFavorites();
}

// Add favorite and save to local storage
function addFavorite(id){
    favoritesArray.push(id);
    saveFavorites();
}

// Remove favorite and save to local storage
export function removeFavorite(id){
    const index = favoritesArray.indexOf(id);
    favoritesArray.splice(index, 1);
    saveFavorites();
}

// Save favorites to local storage
function saveFavorites(){
    localStorage.setItem('favorites', JSON.stringify(favoritesArray));
}