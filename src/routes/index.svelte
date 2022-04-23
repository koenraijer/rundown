<!--
<script context="module">
    let song;

    export const load = async ({fetch, params}) => {
        song = await fetch('./api/now_playing.json').then(res => res.json())
        
        const type = 'tracks'
        const limit = 20;
        const time_range = 'medium_term'

        const data = await fetch('./api/data.json', {
            method: 'POST',
            body: new URLSearchParams({
                type,
                limit: limit.toString(),  
                time_range,
            }).toString()
        }).then(res => res.json()).then(res => {
            res.data.items
        })
        
        return {
            props: {song, data}
        }
    }

</script>
-->

<script>
    import NowPlaying from "$lib/components/NowPlaying.svelte";
    export let song;
    export let data;


    let limit = 20;
    let type = 'tracks';
    let time_range = 'medium_term';
    let show_artist = false;
    
    async function getData() {
        data = await fetch('./api/data.json', {
            method: 'POST',
            body: new URLSearchParams({
                type,
                limit: limit.toString(),  
                time_range,
            }).toString()
        }).then(res => res.json()).then(res => res.data.items)

        data = data;
        limit = limit;
        type = type;
        time_range = time_range
        if(type === "tracks")
            show_artist = true
        else if(type === "artists")
            show_artist = false
    }

    async function getNowPlaying() {
        song = await fetch('../api/now_playing.json').then(res => res.json())
    }

    /*
    setInterval(() => {
        getNowPlaying();
    }, 5000);
    */

    // Authorization Code Flow
    const AUTHORIZE_ENDPOINT = 'https://accounts.spotify.com/authorize'
    const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID
    const redirect_uri = "http://localhost:3000/login" // Don't use trailing slash
    const scope = 'user-read-currently-playing user-top-read'

    let remember_me = false;
    
    function generateRandomString(length) {
        let text = "";
        const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

   // @ts-ignore
     $: params_obj = new URLSearchParams({
        client_id,
        response_type: 'code',
        redirect_uri,
        scope,
        show_dialog: !remember_me,
        state: generateRandomString(16)
    })

    $: url = AUTHORIZE_ENDPOINT + "?" + params_obj

</script>

<div class="grid md:grid-cols-3 gap-x-28">
    <div class="col-span-1">
        <h1 class="text-6xl mb-2 font-bold ">Rundown</h1>
        <h2 class="text-2xl mb-2">Wrapped with no crap</h2>
        <p class="text-gray-500">Built with SvelteKit and deployed on Vercel, this app exists to hand you the facts.</p>
        <div class="my-12 mx-0 w-fit">
            <div class="flex flex-row justify-end">
                <label for="remember_me">Remember me?</label>
                <input name="remember-me" type="checkbox" bind:checked={remember_me} />
            </div>
            <a href={url} class="btn btn-neutral">Connect Spotify</a>
        </div> 
        <div class="my-12 mx-0 w-full">
            <h2 class="card-title mb-4">Now playing</h2>
            <NowPlaying song={song}/>
        </div> 
        <div class="my-12 mx-0 w-full">
            <h2 class="card-title">Your wishes</h2>
            <select bind:value={type} name="type" id="type" class="select select-bordered select-sm w-full max-w-xs my-4">
                <option value="artists">Artists</option>
                <option value="tracks">Tracks</option>
            </select>
            
            <select bind:value={time_range} name="time_range" id="time_range" class="select select-bordered select-sm w-full max-w-xs">
                <option value="short_term">Short term (~4 weeks)</option>
                <option selected value="medium_term">Medium term (~6 months)</option>
                <option value="long_term">Long term (all available data)</option>
            </select>
            
            <div class="flex flex-row flex-nowrap items-center">
                <input bind:value={limit} type="range" min="1" max="50" class="range range-xs w-3/6 my-4">
                <span class="ml-4">{limit}</span>
            </div>
            <div class="flex flex-row row-nowrap justify-start">
                <button class="btn w-full btn-neutral" on:click={getData}>Load</button>
            </div>
        </div> 
        <div>
            <h2 class="card-title">Get your data</h2>
            <button class="btn btn-disabled my-4">Create playlist</button>
            <button class="btn btn-disabled">Export to CSV</button>
        </div>   
    </div>
    <div class="col-span-2">    
        <ol class="list-decimal">
            {#await getData()}
            <li class="flex flex-col flex-nowrap justify-between py-4 text-xl">
                Loading ...
            </li>
            {:then}    
            {#each data as track, index}
                <li class="flex flex-col flex-nowrap justify-between py-4">
                    <a class="font-bold text-xl" href={track.external_urls.spotify} rel="noopener noreferrer" target="_blank">{index + 1}. {track.name}</a> 
                    {#if show_artist}
                    <span class="inline">
                        {#each track.artists as artist, index}
                            {artist.name}{#if track.artists.length > 1 && track.artists.length !== index + 1},&nbsp;{/if} 
                        {/each}
                    </span>
                    {/if}

                </li>
                <hr>
            {/each}
            {/await}
        </ol>
    </div>
</div>










