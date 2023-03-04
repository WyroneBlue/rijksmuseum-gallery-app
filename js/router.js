import { $ } from './helpers.js';
import { showDetails } from './details.js';
import { loadHome } from './home.js';
import { showError } from './error.js';
import { closeWindows } from './main.js';
const main = $('main');

const routes = {
    'home': loadHome,
    'details': showDetails,
    'error': showError,
}

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

export default async() => {

    checkRoute();

    window.addEventListener('hashchange', async () => {
        closeWindows();

        transitionPage(checkRoute);
    })
}

function setBodyId (id) {
    document.body.id = id;
}

function stripHash(hash) {
    return hash.slice(hash.indexOf('#') + 1).split('/')[0];
}

export function transitionPage (func, options = '', time = 1000) {
    main.classList.add('page-transition');
    setTimeout(() => {
        func(options);
        main.classList.remove('page-transition');
    }, time);
}