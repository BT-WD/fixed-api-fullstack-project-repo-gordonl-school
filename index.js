// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const showImageBtn = document.getElementById('show-image-button');
    const showBreedsBtn = document.getElementById('show-breeds-button');
    const dataContainer = document.getElementById('data-container');
    const resultMessage = document.getElementById('result-message');
    const imageResult = document.getElementById('image-result');
    const breedListResult = document.getElementById('breed-list-result');
    const imagePlaceholder = imageResult.querySelector('.image-placeholder');
    const breedListPlaceholder = breedListResult.querySelector('.breed-list-placeholder');

    // Function to fetch and display a random dog image
    async function fetchRandomDog() {
        try {
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.status === 'success') {
                imagePlaceholder.innerHTML = `<img src="${data.message}" alt="Random Dog" style="max-width: 100%; height: auto;">`;
                resultMessage.style.display = 'none';
                imageResult.style.display = 'block';
                breedListResult.style.display = 'none';
            } else {
                throw new Error('API returned error status');
            }
        } catch (error) {
            console.error('Error fetching random dog image:', error);
            imagePlaceholder.innerHTML = '<p>Sorry, could not load a dog image. Please try again.</p>';
            resultMessage.style.display = 'none';
            imageResult.style.display = 'block';
            breedListResult.style.display = 'none';
        }
    }

    // Function to fetch and display the list of all dog breeds and sub-breeds
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
            } else {
                throw new Error('API returned error status');
            }
        } catch (error) {
            console.error('Error fetching breeds list:', error);
            breedListPlaceholder.innerHTML = '<p>Sorry, could not load the breeds list. Please try again.</p>';
            resultMessage.style.display = 'none';
            imageResult.style.display = 'none';
            breedListResult.style.display = 'block';
        }
    }

    // Add event listeners to buttons
    showImageBtn.addEventListener('click', fetchRandomDog);
    showBreedsBtn.addEventListener('click', fetchBreedsList);
});
