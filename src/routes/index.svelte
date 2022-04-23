<script context="module">
    let song;

    export const load = async ({fetch}) => {
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
        }).then(res => res.json()).then(res => res.data.items)

        return {
            props: {song, data}
        }
    }

</script>

<script>
    import NowPlaying from "$lib/components/NowPlaying.svelte";
    export let song;
    export let data;


    let limit = 20;
    let type = 'tracks';
    let time_range = 'medium_term';

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
    }

</script>

<div class="grid md:grid-cols-3 gap-x-28">
    <div class="col-span-1">
        <h1 class="text-6xl mb-2 font-bold ">Rundown</h1>
        <h2 class="text-2xl mb-2">Wrapped with no crap</h2>
        <div class="w-fit my-4">
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
            {#each data as track, index}
                <li class="flex flex-col flex-nowrap justify-between py-4">
                    <a class="font-bold text-xl" href={track.external_urls.spotify} rel="noopener noreferrer" target="_blank">{index + 1}. {track.name}</a> 
                    {#key data}
                    {#if type === "tracks"}
                    <span class="inline">
                        {#each track.artists as artist, index}
                            {artist.name}{#if track.artists.length > 1 && track.artists.length !== index + 1},&nbsp;{/if} 
                        {/each}
                    </span>
                    {/if}
                    {/key}
                </li>
                <hr>
            {/each}
        </ol>
    </div>
</div>










