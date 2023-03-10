import { $ } from './helpers.js';
import { closeWindows } from '../main.js';
import { loadHome } from '../pages/home.js';
import { showDetails } from '../pages/details.js';
import { showError } from './error.js';
const main = $('main');

// routes
const routes = {
    'home': loadHome,
    'details': showDetails,
    'error': showError,
}

// check route and load page
const checkRoute = () => {
    const hash = window.location.hash.split('/')[0];
    if(!hash || hash === 'home'){
        routes['home']();
        setBodyId('home');
    } else if(Object.keys(routes).includes(stripHash(hash))){
        routes[stripHash(hash)]();
        setBodyId(stripHash(hash));
    } else {
        routes['error']();
    }
}

// toggle page transition
export function transitionPage (func, options = '', time = 1000) {
    if(main.classList.contains('error')){
        main.classList.remove('error');
    };

    main.classList.add('page-transition');
    setTimeout(() => {
        func(options);
        main.classList.remove('page-transition');
    }, time);
}

// event listener for hashchange
export default async() => {

    checkRoute();

    window.addEventListener('hashchange', async () => {
        closeWindows();

        transitionPage(checkRoute);
    })
}

// set body id
function setBodyId (id) {
    document.body.id = id;
}

// Remove hash from string
function stripHash(hash) {
    return hash.slice(hash.indexOf('#') + 1).split('/')[0];
}
