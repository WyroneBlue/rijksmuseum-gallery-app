console.log('Hello World!');

const apiKey = 'dJcMjMTI';
const language = 'nl';
const base = `https://www.rijksmuseum.nl/api/${language}/collection?key=${apiKey}`;

const filterButton = document.querySelector('footer > button');
const filters = document.querySelector('aside');
const resultsContainer = document.querySelector('main > ul');
const moreresultsSection = document.querySelector('main > span');

const dialog = document.querySelector('dialog');
console.dir(dialog);

let itemCount = 20;
let page = 1;
let initialLoad = true;

const fetchItems = async () => {
    const data = await fetch(`${base}&ps=${itemCount}&p=${page}`);
    const json = await data.json();
    return json;
}

const moreResultsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(async entry => {
        if (entry.isIntersecting) {
            console.log('more results');
            if(!initialLoad){

                page++;
                const { artObjects: items } = await fetchItems();
                showResults(items);
            }
        }
    });
});
moreResultsObserver.observe(moreresultsSection);


const showDetails = (e, item) => {
    console.log('clicked');
    console.log(item);
    console.log(e.currentTarget);

    console.log(dialog);
    dialog.value = `
        test
    `;

    dialog.showModal();
}

const showResults = (items, fresh = false) => {
    if(fresh) {
        resultsContainer.innerHTML = '';
    }

    if(items.length === 0){
        resultsContainer.innerHTML = '<li>There were no art pieces found</li>';
        return;
    }

    items.forEach(item => {

        const lowerImage = item.webImage.url.replace('s=0', 's=1000');
        const li = `
        <li>
            <h3>${item.title}</h3>
            <img data-src="${lowerImage}" alt="${item.title}">
        </li>
        `;

        resultsContainer.insertAdjacentHTML('beforeend', li);

        const lastItem = resultsContainer.lastElementChild;
        const observerImage = lastItem.querySelector('img');
        const imageObserver = new IntersectionObserver((entries, observer) => {

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.onload = () => {
                        image.removeAttribute('data-src')
                        image.parentElement.classList.add('loaded');
                    }
                    observer.unobserve(image);
                }
            });
        });

        lastItem.addEventListener('click', (e) => showDetails(e, item));
        imageObserver.observe(observerImage);
    });
}

filterButton.addEventListener('click', toggleFilters);
window.addEventListener('load', async () => {
    const { artObjects: items } = await fetchItems();
    console.log(items);

    // setTimeout(() => {
        showResults(items, true);
        initialLoad = false;
    // }, 2000);
});



function toggleFilters (){
    filters.classList.toggle('show');
}

// s=[nummer] voor kleinere imaes