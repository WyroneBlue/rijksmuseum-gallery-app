import { $ } from './helpers.js';
import { showDetails } from './details.js';
import { loadHome } from './home.js';
import { showError } from './error.js';
const main = $('main');

const routes = {
    'home': loadHome,
    'details': showDetails,
    'error': showError,
}

const checkRoute = () => {
    const hash = window.location.hash.split('/')[0];
    if(!hash){
        routes['home']();
    } else if(Object.keys(routes).includes(stripHash(hash))){
        routes[stripHash(hash)]();
    } else {
        routes['error']();
    }
}

export default async() => {

    checkRoute();

    window.addEventListener('hashchange', async (e) => {
        main.classList.add('loading');
        setTimeout(() => {
            checkRoute();
            main.classList.remove('loading');
        }, 1000);
    })
}

function stripHash(hash) {
    return hash.slice(hash.indexOf('#') + 1).split('/')[0];
}