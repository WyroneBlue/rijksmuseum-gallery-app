import { $ } from './helpers.js';
const main = $('main');


export const showError = async () => {
    main.innerHTML = `
        <a href="#home">Back to home</a>
        <h1>404</h1>
        <p>Page not found</p>
    `;
}