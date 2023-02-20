import { $ } from './helpers.js';
import { fetchItems } from './data.js';

const main = $('main');
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
            <a href="#home">Back to home</a>

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

            const lowerImage = item.webImage.url.replace('s=0', 's=1000');
            const li = `
            <li>
                <a href="#details/${item.objectNumber}">
                    <h3>${item.title}</h3>
                    <img data-src="${lowerImage}" alt="${item.title}">
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
            const imageOptions = {
                threshold: 0.2
            }

            const imageObserver = new IntersectionObserver((entries, observer) => {

                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        image.src = image.dataset.src;
                        image.onload = () => {
                            image.removeAttribute('data-src')
                            image.parentElement.parentElement.classList.add('loaded');
                        }
                        observer.unobserve(image);
                    }
                });
            }, imageOptions);
            imageObserver.observe(observerImage);

            const saveButton = lastItem.querySelector('button:first-of-type');
            const infoButton = lastItem.querySelector('button:last-of-type');

            saveButton.addEventListener('click', (e) => saveFavorite(e, item));
            infoButton.addEventListener('click', (e) => showDetails(e, item));
        });

        let moreResultsOptions = {
            rootMargin: '0px 0px -50px 0px',
            threshold: 1
        }

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
        }, moreResultsOptions);

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

    window.addEventListener('click', (e) => {
        if (e.target === dialog && dialog.open) {
            closeDialog();
        }
    });

    function closeDialog () {
        dialog.close();
        dialog.innerHTML = '';
    }
}
