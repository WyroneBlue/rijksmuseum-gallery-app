import { $ } from '../modules/helpers.js';
const main = $('main');

// show error page
export const showError = async () => {
    main.classList = 'error';
    main.innerHTML = `
        <h2>Page or art not found</h2>
        <p>404</p>
        <a href="#home">Back to home</a>
    `;
}