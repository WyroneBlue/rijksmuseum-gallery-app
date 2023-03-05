import { $ } from "./helpers.js";
import { fetchDetailImages } from "./data.js";
import { isMobile } from "./helpers.js";
import { showInfo } from "../pages/details.js";

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

    let showOptions = {
        text: '',
        class: '',
    }

    if (isMobile) {
        showOptions.text = `Click for options`;
        showOptions.class = 'mobile';
    } else {
        showOptions.text = `Hover for options`;
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
            <button tabIndex="-1" class="${showOptions.class}">${showOptions.text}</button>
        </article>
    </li>
    `;
    resultsContainer.insertAdjacentHTML('beforeend', html);

    const lastItem = resultsContainer.lastElementChild;
    const infoButton = $('section > button:last-of-type', lastItem);
    infoButton.addEventListener('click', (e) => showInfo(e, item));

    if(isMobile){
        const optionsButton = $('article > button', lastItem);

        optionsButton.addEventListener('touchstart', (e) => {

            e.target.closest('li').classList.toggle('show-options');

            setTimeout(() => {
                e.target.closest('li').classList.add('continue-navigation');
            }, 500);

            setTimeout(() => {
                e.target.closest('li').classList.remove('continue-navigation');
                e.target.closest('li').classList.toggle('show-options');
            }, 5000);
        });
    }

    if(observe){

        const observerImage = $('img', lastItem);
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