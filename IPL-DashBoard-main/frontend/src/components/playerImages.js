// This file is no longer a static lookup table. It fetches image URLs from the backend API.
// This is a more dynamic and maintainable approach.

const getPlayerImageUrl = async (playerName) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_ROOT_URL.replace('/api/v1', '')}/api/images/player/${playerName}`);
        const playerData = await response.json();
        return playerData ? playerData.imageUrl : 'https://placehold.co/100x100/1F2937/F3F4F6?text=Player';
    } catch (err) {
        console.error("Error fetching player image:", err);
        return 'https://placehold.co/100x100/1F2937/F3F4F6?text=Error';
    }
};

export default getPlayerImageUrl;
