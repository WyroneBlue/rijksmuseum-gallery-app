console.log('Hello World!');

import { $ } from './helpers.js';
import router from './router.js';

const filterButton = $('footer > button');
const filters = $('aside');

filterButton.addEventListener('click', toggleFilters);

function toggleFilters (){
    filters.classList.toggle('show');
}

router();