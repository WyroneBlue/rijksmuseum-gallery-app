import { fetchDetailImages } from "./data.js";
import { showInfo } from "./details.js";

export const artcard = async({ item, saveButtonIcon, resultsContainer, observe = false, }) => {

    const images = await fetchDetailImages(item.objectNumber);

    let img;
    let alt;
    if(images && images.levels){
        const { tiles } = images.levels.filter(image => image.name === "z4")[0];
        const lowestImage = tiles[0].url;
        img = lowestImage;
        alt = item.title;

    } else {

        const imgPlaceholder = 'https://via.placeholder.com/300x300?text=No+image+available';
        img = imgPlaceholder;
        alt = `${item.title} Only available in the Rijksmuseum`;
    }

    let html = `
    <li>
        <article>
            <a href="#details/${item.objectNumber}">
                <h3>${item.title}</h3>
                <img data-src="${img}" alt="${alt}">
            </a>
            <section>
                <button>${saveButtonIcon}</button>
                <button>ℹ️</button>
            </section>
        </article>
    </li>
    `;
    resultsContainer.insertAdjacentHTML('beforeend', html);

    const lastItem = resultsContainer.lastElementChild;
    const infoButton = lastItem.querySelector('button:last-of-type');
    infoButton.addEventListener('click', (e) => showInfo(e, item));

    if(observe){

        const observerImage = lastItem.querySelector('img');
        const imageOptions = {
            rootMargin: '0px 0px 200px 0px',
        }

        const imageObserver = new IntersectionObserver((entries, observer) => {

            entries.forEach(entry => {
                const image = entry.target;

                if (entry.isIntersecting) {
                    image.src = image.dataset.src;
                    image.onload = () => {
                        image.removeAttribute('data-src')
                        image.parentElement.parentElement.parentElement.classList.add('loaded');
                    }
                    // observer.unobserve(image);
                } else {
                    image.parentElement.parentElement.parentElement.classList.remove('loaded');
                    image.dataset.src = img;
                    image.src = '';
                }
            });
        }, imageOptions);
        imageObserver.observe(observerImage);
    }

    return;
}