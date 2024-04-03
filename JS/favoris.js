const main = document.querySelector('main');
const aboveMain = document.querySelector('.above-main');

function showFavorites() {
    const url = `https://www.googleapis.com/books/v1/volumes/`;
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    console.log(favorites);
    if (favorites.length === 0) {
        console.log('No favorites');
    } else {
    // Use slice to get only the first four favorites
    favorites.slice(0, 4).forEach(id => {
        fetch(url + id)
            .then(response => response.json())
            .then(data => {
                const book = data;
                console.log(book);
                const bookCard = document.createElement('div');
                bookCard.classList.add('book-card');

                // Titre raccourci à 15 caractères (pour tenir sur une ligne)
                const maxChars = 15; // Nombre maximum de caractères à afficher
                const titleText = book.volumeInfo.title;
                const displayTitle = titleText.length > maxChars ? titleText.substring(0, maxChars) + '...' : titleText;

                // Auteurs raccourcis à 15 caractères (pour tenir sur une ligne)
                const maxLetter = 15; // Nombre maximum de caractères à afficher
                let displayAuthors = '';

                if (book.volumeInfo.authors) {
                    const authorsText = book.volumeInfo.authors.join(', '); // Joindre plusieurs auteurs en une seule chaîne
                    displayAuthors = authorsText.length > maxLetter ? authorsText.substring(0, maxLetter) + '...' : authorsText;
                } else {
                    displayAuthors = 'Unknown';
                }

                // Vérifier si imageLinks et thumbnail sont disponibles, sinon utiliser une image par défaut
                const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://img.freepik.com/vecteurs-libre/pile-design-plat-dessine-main-illustration-livres_23-2149341898.jpg?size=338&ext=jpg&ga=GA1.1.1546980028.1711324800&semt=sph';

                bookCard.innerHTML = `
                    <img src="${thumbnail}" alt="${thumbnail}">
                    <h2 title="${book.volumeInfo.title}">${displayTitle}</h2>
                    <p title="${book.volumeInfo.authors}">${displayAuthors}</p>*
                    <button><a href="${book.volumeInfo.previewLink}" target="_blank">Preview</a></button>
                `;
                
                aboveMain.innerHTML = `
                <h1 style="text-align: center;">Bienvenue !</h1>
                <h2 style="text-align: center;">Voici les livres que vous avez ajouté dans vos favoris :</h2>
                `
                main.appendChild(bookCard);
            })
            .catch(err => {
                console.log(err);
                main.innerHTML = '<h2>Something went wrong</h2>';
            });
        });
}}

showFavorites();