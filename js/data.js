import { get } from './helpers.js';

const apiKey = 'dJcMjMTI';
const language = 'nl';
const base = `https://www.rijksmuseum.nl/api/${language}/collection`;
const baseWithKey = `${base}?key=${apiKey}`;

const itemCount = 20;

export const fetchItems = async (page) => await get(`${baseWithKey}&ps=${itemCount}&p=${page}`);
export const fetchDetails = async (id) => await get(`${base}/${id}?key=${apiKey}&ps=1`);