const body = document.querySelector('body');
const form = document.querySelector('.form');
const input = document.createElement('input');

const select = document.createElement('select');
select.classList.add('select');
select.innerHTML = `
    <option>--------------------</option>
    <option value="action">Action</option>
    <option value="fiction">Fiction</option>
    <option value="horror">Horror</option>
    <option value="romance">Romance</option>
    <option value="scifi">Science Fiction</option>
    <option value="mystery">Mystery</option>
    <option value="thriller">Thriller</option>
    <option value="fantasy">Fantasy</option>
    <option value="adventure">Adventure</option>
    <option value="biography">Biography</option>
    <option value="history">History</option>
    <option value="science">Science</option>
    <option value="religion">Religion</option>
    <option value="travel">Travel</option>
    <option value="cooking">Cooking</option>
    <option value="health">Health</option>
    <option value="fitness">Fitness</option>
    <option value="sports">Sports</option>
    <option value="education">Education</option>
    <option value="music">Music</option>
    <option value="art">Art</option>    
    <option value="photography">Photography</option>
    <option value="computers">Computers</option>
    <option value="programming">Programming</option>
    <option value="business">Business</option>
    <option value="economics">Economics</option>
    <option value="finance">Finance</option>
    <option value="marketing">Marketing</option>
    <option value="management">Management</option>
    <option value="psychology">Psychology</option>
    <option value="selfhelp">Self-Help</option>
    <option value="family">Family</option>
    <option value="relationships">Relationships</option>
    <option value="games">Games</option>
    <option value="comics">Comics</option>
    <option value="graphicnovels">Graphic Novels</option>
    <option value="poetry">Poetry</option>
    <option value="drama">Drama</option>
    <option value="humor">Humor</option>
    <option value="children">Children</option>
    <option value="youngadult">Young Adult</option>
`;

const btn = document.createElement('button');
btn.textContent = 'Search';

const favorisBtn = document.createElement('button');
favorisBtn.textContent = 'Favoris';
favorisBtn.classList.add('favlist');
const favorites = JSON.parse(localStorage.getItem('favorites')) || []; // Retrieve favorites from localStorage

const hr = document.createElement('hr');

const container = document.createElement('div');
container.classList.add('container');

form.appendChild(input)
form.appendChild(select)
form.appendChild(favorisBtn)
form.appendChild(btn)

body.appendChild(hr)
body.appendChild(container);

function search() {
    const maxResults = 20; // Number of results per page
    const startIndex = 0; // Starting index for results (0-based)
    const url = `https://www.googleapis.com/books/v1/volumes?q=${input.value}+subject:${select.value}&startIndex=${startIndex}&maxResults=${maxResults}&langRestrict=fr`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const title = input.value;
            const books = data.items;
            console.log(books);
            container.innerHTML = '';
            if (books) {
                books.forEach(book => {
                    const bookCard = document.createElement('div');
                    bookCard.classList.add('book-card');

                    // Trimming the title to fit within one line
                    const maxChars = 15; // Maximum number of characters to display
                    const titleText = book.volumeInfo.title;
                    const displayTitle = titleText.length > maxChars ? titleText.substring(0, maxChars) + '...' : titleText;

                    // Trimming the authors' names to fit within one line
                    const maxLetter = 15; // Maximum number of characters to display
                    let displayAuthors = '';

                    if (book.volumeInfo.authors) {
                        const authorsText = book.volumeInfo.authors.join(', '); // Join multiple authors into a single string
                        displayAuthors = authorsText.length > maxLetter ? authorsText.substring(0, maxLetter) + '...' : authorsText;
                    } else {
                        displayAuthors = 'Unknown';
                    }

                    // Check if imageLinks and thumbnail are available
                    const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://img.freepik.com/vecteurs-libre/pile-design-plat-dessine-main-illustration-livres_23-2149341898.jpg?size=338&ext=jpg&ga=GA1.1.1546980028.1711324800&semt=sph';

                    bookCard.innerHTML = `
                        <img src="${thumbnail}" alt="${thumbnail}">
                        <h2 title="${book.volumeInfo.title}">${displayTitle}</h2>
                        <p title="${book.volumeInfo.authors}">${displayAuthors}</p>
                        <p>${book.volumeInfo.publishedDate}</p>
                        <button><a href="${book.volumeInfo.previewLink}" target="_blank">Preview</a></button>
                        <button class="favoris" data-id="${book.id}">Favoris</button>
                    `;
                    const favoriButton = bookCard.querySelector('.favoris');
                    favoriButton.addEventListener('click', (e) => {
                        const id = e.target.getAttribute('data-id');
                        const isFavori = favoriButton.classList.toggle('isFavori');
                        favoriButton.textContent = isFavori ? 'Retirer des favoris' : 'Ajouter aux favoris';
                        if (isFavori) {
                            favorites.push(id);
                            favoriButton.style.backgroundColor = 'red';
                        } else {
                            const index = favorites.indexOf(id);
                            if (index > -1) {
                                favorites.splice(index, 1);
                            }
                            favoriButton.style.backgroundColor = '#efefef';
                        }
                        localStorage.setItem('favorites', JSON.stringify(favorites)); // Store favorites in localStorage
                        console.log(isFavori ? 'Ajout du film aux favoris:' : 'Retrait du film des favoris:', book);
                    });
                    container.appendChild(bookCard);
                })
            } else {
                container.innerHTML = '<h2>No books found</h2>';
            }
        })
        .catch(err => {
            console.log(err);
            container.innerHTML = '<h2>Something went wrong</h2>';
        });
}

btn.addEventListener('click', () => {
    search();
});

input.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        search();
    }
});

favorisBtn.addEventListener('click', showFavorites);

function showFavorites() {
    container.innerHTML = '';
    const url = `https://www.googleapis.com/books/v1/volumes/`;
    console.log(favorites);
    favorites.forEach(id => {
        fetch(url + id)
            .then(response => response.json())
            .then(data => {
                const book = data; // Since data is the book object itself
                console.log(book);
                const bookCard = document.createElement('div');
                bookCard.classList.add('book-card');

                // Trimming the title to fit within one line
                const maxChars = 15; // Maximum number of characters to display
                const titleText = book.volumeInfo.title;
                const displayTitle = titleText.length > maxChars ? titleText.substring(0, maxChars) + '...' : titleText;

                // Trimming the authors' names to fit within one line
                const maxLetter = 15; // Maximum number of characters to display
                let displayAuthors = '';

                if (book.volumeInfo.authors) {
                    const authorsText = book.volumeInfo.authors.join(', '); // Join multiple authors into a single string
                    displayAuthors = authorsText.length > maxLetter ? authorsText.substring(0, maxLetter) + '...' : authorsText;
                } else {
                    displayAuthors = 'Unknown';
                }

                // Check if imageLinks and thumbnail are available
                const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://img.freepik.com/vecteurs-libre/pile-design-plat-dessine-main-illustration-livres_23-2149341898.jpg?size=338&ext=jpg&ga=GA1.1.1546980028.1711324800&semt=sph';

                bookCard.innerHTML = `
                <img src="${thumbnail}" alt="${thumbnail}">
                <h2 title="${book.volumeInfo.title}">${displayTitle}</h2>
                <p title="${book.volumeInfo.authors}">${displayAuthors}</p>
                <p>${book.volumeInfo.publishedDate}</p>
                <button><a href="${book.volumeInfo.previewLink}" target="_blank">Preview</a></button>
                <button class="favoris" data-id="${book.id}">Favoris</button>
            `;

        const favoriButton = bookCard.querySelector('.favoris');

        if (favorites.includes(book.id)) {
            favoriButton.classList.add('isFavori');
            favoriButton.textContent = 'Retirer des favoris';
            favoriButton.style.backgroundColor = 'red';
        }

        favoriButton.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const isFavori = favoriButton.classList.toggle('isFavori');

            if (isFavori) {
                favorites.push(id);
                favoriButton.textContent = 'Retirer des favoris';
                favoriButton.style.backgroundColor = 'red';
            } else {
                const index = favorites.indexOf(id);
                if (index > -1) {
                    favorites.splice(index, 1);
                }
                favoriButton.textContent = 'Ajouter aux favoris';
                favoriButton.style.backgroundColor = '#efefef';
            }
            localStorage.setItem('favorites', JSON.stringify(favorites)); // Store favorites in localStorage
            console.log(isFavori ? 'Ajout du livre aux favoris:' : 'Retrait du livre des favoris:', book);
        });

        container.appendChild(bookCard);
    })
    .catch(err => {
        console.log(err);
        container.innerHTML = '<h2>Something went wrong</h2>';
    });
});
}