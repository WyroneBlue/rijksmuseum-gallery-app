export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);
export const get = async (url) => {
    const response = await fetch(url);
    return await response.json();
}