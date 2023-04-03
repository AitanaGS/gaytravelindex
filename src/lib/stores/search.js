import { writable, derived } from 'svelte/store';

export const searchResult = writable('');

export const activeSearch = writable(false);

export const cleanData = writable(false);

// export let searchValue = writable('');
