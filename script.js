const body = document.querySelector('body');
const form = document.querySelector('.form');
const input = document.createElement('input');

// const select = document.createElement('select');
// select.classList.add('select');
// select.innerHTML = `
//     <option value="intitle">Title</option>
//     <option value="inauthor">Author</option>
//     <option value="inpublisher">Publisher</option>
//     <option value="subject">Subject</option>
//     <option value="isbn">ISBN</option>
//     <option value="lccn">LCCN</option>
//     <option value="oclc">OCLC</option>
// `;

const btn = document.createElement('button');
btn.textContent = 'Search';

const favorisBtn = document.createElement('button');
favorisBtn.textContent = 'Favoris';
favorisBtn.classList.add('favlist');
const favorites = [];

const hr = document.createElement('hr');

const container = document.createElement('div');
container.classList.add('container');

form.appendChild(input)
// form.appendChild(select)
form.appendChild(favorisBtn)
form.appendChild(btn)

body.appendChild(hr)
body.appendChild(container);

function search() {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${input.value}`;
    
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

                    bookCard.innerHTML = `
                        <img src="${book.volumeInfo.imageLinks.thumbnail}" alt="${book.volumeInfo.title}">
                        <h2 title="${book.volumeInfo.title}">${displayTitle}</h2>
                        <p>${book.volumeInfo.authors}</p>
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
    const url = `https://www.googleapis.com/books/v1/volumes/${id}`;
    favorites.forEach(id => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const book = data.items
                const bookCard = document.createElement('div');
                bookCard.classList.add('book-card');
                bookCard.innerHTML = `
                    <img src="${book.volumeInfo.imageLinks.thumbnail}">
                    <h2>${book.volumeInfo.title}</h2>
                    <p>${book.volumeInfo.authors}</p>
                    <p>${book.volumeInfo.publishedDate}</p>
                    <button><a href="${book.volumeInfo.previewLink}" target="_blank">Preview</a></button>
                    <button class="favoris" data-id="${book.id}">Favoris</button>
                `;
                container.appendChild(bookCard);
            })
            .catch(err => {
                console.log(err);
                container.innerHTML = '<h2>Something went wrong</h2>';
            });
    })
}