import { writable } from 'svelte/store';

export const query = writable('');

export const activeSearch = writable(false);
