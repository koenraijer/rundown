import { writable } from 'svelte/store';

export const token = writable({
    access_token: "access_token",
})