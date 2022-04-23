import { writable } from "svelte/store";

export const auth = writable({
    access_token: "",
    expires_in: "",
    expires_at: "",
})

export const url = writable(
    "https://rundown-ruddy.vercel.app"
)