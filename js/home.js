import { $ } from './helpers.js';
import { fetchItems, searchItems } from './data.js';
import { toggleFilters } from './main.js';

const main = $('main');
const form = $('aside form');
const dialog = $('dialog');

let page = 1;
let initialLoad = true;
export const loadHome = async () => {

    const saveFavorite = (e, item) => {
        console.log('save favorite', item);
    }

    const showDetails = (e, item) => {
        console.dir(dialog);
        dialog.innerHTML = `
            <a href="#home">Close</a>

            <section>
                <h1>${item.title}</h1>
                <p>${item.longTitle}</p>
            </section>

            <div>
                <a href="${item.links.web}" target="_blank">Bekijk op rijksmuseum</a>
                <a href="#details/${item.objectNumber}">
                    Bekijk detail pagina
                </a>
            </div>
        `;

        const detailButton = dialog.querySelector('a:last-of-type');
        detailButton.addEventListener('click', () => {
            closeDialog();
            console.log('details and close');
        });

        dialog.showModal();
    }

    renderSkeleton();

    const { artObjects: items } = await fetchItems(page);

    // setTimeout(() => {
    renderHTML(items, true);
    initialLoad = false;
    // }, 2000);

    function renderHTML (items, fresh = false) {
        const resultsContainer = $('main > ul');
        const moreresultsSection = $('main > span');
        if (fresh) {
            resultsContainer.innerHTML = '';
        }

        if (items.length === 0) {
            resultsContainer.innerHTML = '<li>There were no art pieces found</li>';
            return;
        }

        items.forEach(item => {

            const img = item.webImage ? item.webImage.url : 'https://via.placeholder.com/300x300';
            const alt = item.webImage ? item.title : `${item.title} Only available in the Rijksmuseum`;

            const li = `
            <li>
                <a href="#details/${item.objectNumber}">
                    <h3>${item.title}</h3>
                    <img data-src="${img}" alt="${alt}">
                </a>
                <section>
                    <button>(+)</button>
                    <button>(i)</button>
                </section>
            </li>
            `;

            resultsContainer.insertAdjacentHTML('beforeend', li);

            const lastItem = resultsContainer.lastElementChild;
            const observerImage = lastItem.querySelector('img');
            // const imageOptions = {
            //     threshold: 0.2
            // }

            const imageObserver = new IntersectionObserver((entries, observer) => {

                entries.forEach(entry => {
                    const image = entry.target;
                    if (entry.isIntersecting) {
                        image.src = image.dataset.src;
                        image.onload = () => {
                            image.removeAttribute('data-src')
                            image.parentElement.parentElement.classList.add('loaded');
                        }
                        // observer.unobserve(image);
                    } else {
                        image.parentElement.parentElement.classList.remove('loaded');
                        image.dataset.src = img;
                        image.src = '';
                    }
                });
            });
            // , imageOptions);
            imageObserver.observe(observerImage);

            const saveButton = lastItem.querySelector('button:first-of-type');
            const infoButton = lastItem.querySelector('button:last-of-type');

            saveButton.addEventListener('click', (e) => saveFavorite(e, item));
            infoButton.addEventListener('click', (e) => showDetails(e, item));
        });

        // let moreResultsOptions = {
        //     rootMargin: '0px 0px -50px 0px',
        //     threshold: 1
        // }

        const moreResultsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(async entry => {
                if (entry.isIntersecting) {
                    console.log('more results');
                    if (!initialLoad) {

                        page++;
                        const { artObjects: items } = await fetchItems(page);
                        renderHTML(items);
                    }
                }
            });
        });
        // , moreResultsOptions);

        moreResultsObserver.observe(moreresultsSection);
    }


    function renderSkeleton () {
        let html = '<ul>';

        for (let i = 0; i < 10; i++) {
            html += `
                <li class="skeleton"></li>
            `;
        }

        html += '</ul><span></span>';

        main.innerHTML = html;
    }

    function closeDialog () {
        dialog.close();
        dialog.innerHTML = '';
    }

    window.addEventListener('click', (e) => {
        if (e.target === dialog && dialog.open) {
            closeDialog();
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const search = form.querySelector('label:first-of-type input').value;
        const sort = form.querySelector('fieldset input:checked').value;
        const topPiece = form.querySelector('label:last-of-type input[name="top-piece"]').checked;
        const imageOnly = form.querySelector('label:last-of-type input[name="image-only"]').checked;

        toggleFilters();

        const { artObjects: items } = await searchItems(page, search, sort, topPiece, imageOnly);
        console.log(items);
        renderHTML(items, true);
    });

}
