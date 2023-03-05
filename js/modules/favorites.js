import { $ } from './helpers.js';

const favorites = localStorage.getItem('favorites');
export const favoritesArray = favorites ? JSON.parse(favorites) : [];

export const isFavorite = (objectNumber) => favoritesArray.some(id => id === objectNumber);

export const emptyState = (list) => {
    list.innerHTML = '<p>There are no favorites yet.</p>';
}

export const showFavoritesCount = () => {
    const favoritesCount = $('aside[aria-label="favorites"] h2 span');
    favoritesCount.innerHTML = favoritesArray.length;

    return favoritesArray.length;
}

export const showFavoriteAnimation = (el, className, icon) => {
    el.classList.add(className);
    el.addEventListener('animationend', () => {
        el.classList.remove(className);
        el.innerHTML = icon;
    });
}

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

function addFavorite(id){
    favoritesArray.push(id);
    saveFavorites();
}

export function removeFavorite(id){
    const index = favoritesArray.indexOf(id);
    favoritesArray.splice(index, 1);
    saveFavorites();
}

function saveFavorites(){
    localStorage.setItem('favorites', JSON.stringify(favoritesArray));
}