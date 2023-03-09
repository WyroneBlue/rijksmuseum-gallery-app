// check if user is using mobile device
export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// query selector shorthand
export const $ = (selector, el = document) => el.querySelector(selector);

// query selector all shorthand
export const $$ = (selector, el = document) => el.querySelectorAll(selector);

// fetch including trycatch
export const get = async (url) => {
    try {

        const response = await fetch(url);
        if(!response.ok && response.status === 403) {
            throw new Error('This art piece is not available');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        return error;
    }
}

// Mapping over an array and returning a promise
export const awaitMap = async (callback) => {
    return await Promise.all(callback);
};