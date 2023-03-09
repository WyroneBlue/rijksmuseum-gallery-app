import { $ } from "./helpers.js";
import { fetchDetailImages } from "./data.js";
import { isMobile } from "./helpers.js";
import { showInfo } from "../pages/details.js";

// Art card component
export const artCard = async({ item, saveButtonIcon, resultsContainer, observe = false, }) => {

    let img;
    let alt;

    try { // Try to get the low "z4" image quality

        const images = await fetchDetailImages(item.objectNumber);
        if(images && images.levels){
            const { tiles } = images.levels.filter(image => image.name === "z4")[0];
            const lowestImage = tiles[0].url.replace('http', 'https');
            img = lowestImage;
        } else {
            img = item.webImage.url;
        }
        alt = `Image for ${item.title}.`;

    } catch (error) { // If that fails, use a placeholder image

        const imgPlaceholder = './assets/images/explore-placeholder.jpg';
        img = imgPlaceholder;
        alt = `Placeholder image for ${item.title}. This image is only available in the Rijksmuseum`;
    }

    // initialize options for mobile and desktop
    let showOptions = {
        text: '',
        class: '',
    }

    // set options for mobile and desktop
    if (isMobile) {
        showOptions.text = `Click for options`;
        showOptions.class = 'mobile';
    } else {
        showOptions.text = `Hover for options`;
    }

    // create the html
    let html = `
    <li>
        <article>
            <a href="#details/${item.objectNumber}">
                <h3>${item.title}</h3>
                <img data-src="${img}" alt="${alt}">
            </a>
            <menu>
                <li>
                    <button>${saveButtonIcon}</button>
                </li>
                <li>
                    <button>ℹ️</button>
                </li>
            </menu>
            <button tabIndex="-1" class="${showOptions.class}">${showOptions.text}</button>
        </article>
    </li>
    `;

    // insert the html to the given container
    resultsContainer.insertAdjacentHTML('beforeend', html);

    // get the last item in the container
    const lastItem = resultsContainer.lastElementChild;

    // add event listeners to the last item
    const infoButton = $('menu li:last-of-type button', lastItem);
    infoButton.addEventListener('click', (e) => showInfo(e, item));

    // check if the device is mobile
    if(isMobile){

        // get the options overlay button
        const optionsButton = $('article > button', lastItem);

        // if the overlay button is clicked toggle the options menu
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

    // check if card needs to be observed
    if(observe){

        // select the image to observe
        const observerImage = $('img', lastItem);
        const imageOptions = {
            rootMargin: '0px 0px 200px 0px',
        }

        const imageObserver = new IntersectionObserver((entries, observer) => {

            entries.forEach(entry => {
                const image = entry.target;

                // if the image is in the viewport, load the image else remove the image
                if (entry.isIntersecting) {
                    image.src = image.dataset.src;
                    image.onload = () => {
                        image.removeAttribute('data-src')
                        image.parentElement.parentElement.parentElement.classList.add('loaded');
                    }
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