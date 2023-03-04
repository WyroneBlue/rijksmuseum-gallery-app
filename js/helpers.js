export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);
export const get = async (url) => {
    try {

        const response = await fetch(url);
        if(!response.ok && response.status === 403) {
            throw new Error('This art piece is not available');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}