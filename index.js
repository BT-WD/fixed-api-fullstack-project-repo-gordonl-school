document.addEventListener('DOMContentLoaded', () => {
    const showImageBtn = document.getElementById('show-image-button');
    const showBreedsBtn = document.getElementById('show-breeds-button');
    const showFavoritesBtn = document.getElementById('show-favorites-button');
    const dataContainer = document.getElementById('data-container');
    const resultMessage = document.getElementById('result-message');
    const imageResult = document.getElementById('image-result');
    const breedListResult = document.getElementById('breed-list-result');
    const favoritesResult = document.getElementById('favorites-result');
    const imagePlaceholder = imageResult.querySelector('.image-placeholder');
    const breedListPlaceholder = breedListResult.querySelector('.breed-list-placeholder');
    const favoritesPlaceholder = favoritesResult.querySelector('.favorites-placeholder');
    const saveFavoriteImageBtn = document.getElementById('save-favorite-image');

    let currentImageUrl = '';
    function getFavorites() {
        const favorites = localStorage.getItem('favoriteDogs');
        return favorites ? JSON.parse(favorites) : [];
    }

    function saveFavorite(url) {
        const favorites = getFavorites();
        if (!favorites.includes(url)) {
            favorites.push(url);
            localStorage.setItem('favoriteDogs', JSON.stringify(favorites));
            alert('Image saved to favorites!');
        } else {
            alert('This image is already in favorites.');
        }
    }

    function displayFavorites() {
        const favorites = getFavorites();
        if (favorites.length === 0) {
            favoritesPlaceholder.innerHTML = '<p>No favorites saved yet.</p>';
        } else {
            let html = '<div class="favorites-gallery">';
            favorites.forEach(url => {
                html += `<img src="${url}" alt="Favorite Dog" style="max-width: 200px; margin: 10px;">`;
            });
            html += '</div>';
            favoritesPlaceholder.innerHTML = html;
        }
        resultMessage.style.display = 'none';
        imageResult.style.display = 'none';
        breedListResult.style.display = 'none';
        favoritesResult.style.display = 'block';
    }

    async function fetchRandomDog() {
        try {
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.status === 'success') {
                currentImageUrl = data.message;
                imagePlaceholder.innerHTML = `<img src="${data.message}" alt="Random Dog" style="max-width: 100%; height: auto;">`;
                saveFavoriteImageBtn.style.display = 'block';
                resultMessage.style.display = 'none';
                imageResult.style.display = 'block';
                breedListResult.style.display = 'none';
                favoritesResult.style.display = 'none';
            } else {
                throw new Error('API returned error status');
            }
        } catch (error) {
            console.error('Error fetching random dog image:', error);
            imagePlaceholder.innerHTML = '<p>Sorry, could not load a dog image. Please try again.</p>';
            saveFavoriteImageBtn.style.display = 'none';
            resultMessage.style.display = 'none';
            imageResult.style.display = 'block';
            breedListResult.style.display = 'none';
            favoritesResult.style.display = 'none';
        }
    }

   
    async function fetchBreedsList() {
        try {
            const response = await fetch('https://dog.ceo/api/breeds/list/all');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.status === 'success') {
                const breeds = data.message;
                let html = '<ul>';
                for (const [breed, subBreeds] of Object.entries(breeds)) {
                    html += `<li><strong>${breed}</strong>`;
                    if (subBreeds.length > 0) {
                        html += `: ${subBreeds.join(', ')}`;
                    }
                    html += '</li>';
                }
                html += '</ul>';
                breedListPlaceholder.innerHTML = html;
                resultMessage.style.display = 'none';
                imageResult.style.display = 'none';
                breedListResult.style.display = 'block';
                favoritesResult.style.display = 'none';
            } else {
                throw new Error('API returned error status');
            }
        } catch (error) {
            console.error('Error fetching breeds list:', error);
            breedListPlaceholder.innerHTML = '<p>Sorry, could not load the breeds list. Please try again.</p>';
            resultMessage.style.display = 'none';
            imageResult.style.display = 'none';
            breedListResult.style.display = 'block';
            favoritesResult.style.display = 'none';
        }
    }

    showImageBtn.addEventListener('click', fetchRandomDog);
    showBreedsBtn.addEventListener('click', fetchBreedsList);
    showFavoritesBtn.addEventListener('click', displayFavorites);
    saveFavoriteImageBtn.addEventListener('click', () => {
        if (currentImageUrl) {
            saveFavorite(currentImageUrl);
        }
    });
});
