console.log('Hello World!');

import { $ } from './helpers.js';
import router from './router.js';

const filterButton = $('footer > button');
const filterClose = $('aside > section button');
const filters = $('aside');

filterButton.addEventListener('click', toggleFilters);
filterClose.addEventListener('click', toggleFilters);

export function toggleFilters (){
    filters.classList.toggle('show');
}

router();