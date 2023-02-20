import { $ } from './helpers.js';
import { fetchDetails } from './data.js';
const main = $('main');


export const showDetails = async() => {
    renderSkeleton();

    const id = window.location.hash.split('/')[1];
    console.log(id);
    const { artObject: details} = await fetchDetails(id);

    renderHTML(details);

    function renderHTML (details) {

        main.innerHTML = `
            <a href="#home">Back to home</a>
            <h1>${details.title}</h1>
            <img src="${details.webImage.url}" alt="${details.title}">
            <p>${details.longTitle}</p>
        `;
    }

    function renderSkeleton () {
        main.innerHTML = `
            <h1>loading...</h1>
        `;
    }
}
