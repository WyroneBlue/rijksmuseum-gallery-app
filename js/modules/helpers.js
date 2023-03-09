export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
export const $ = (selector, el = document) => el.querySelector(selector);
export const $$ = (selector, el = document) => el.querySelectorAll(selector);
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

export const awaitMap = async (callback) => {
    return await Promise.all(callback);
};