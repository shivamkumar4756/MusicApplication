 
// Fetch Playlist Tracks with Pagination
async function fetchAllPlaylistTracks(playlistId, accessToken) {
    let tracks = [];
    let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    try {
        while (url) {
            const response = await fetch(url, {
                method: "GET",
                headers: { "Authorization": `Bearer ${accessToken}` }
            });

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

            const data = await response.json();
            tracks = tracks.concat(data.items.filter(item => item.track.preview_url));
            url = data.next; // URL for the next page of results
        }
    } catch (error) {
        console.error("Error fetching playlist tracks:", error.message);
    }
    return tracks;
}

