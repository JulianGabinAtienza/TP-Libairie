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

const hr = document.createElement('hr');

const container = document.createElement('div');
container.classList.add('container');

form.appendChild(input)
// form.appendChild(select)
form.appendChild(btn)
body.appendChild(hr)

body.appendChild(container);

function search() {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${input.value}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const title = input.value;
            const books = data.items
            console.log(books);
            container.innerHTML = '';
            if (books) {
                books.forEach(book => {
                    const bookCard = document.createElement('div');
                    bookCard.classList.add('book-card');
                    bookCard.innerHTML = `
                        <img src="${book.volumeInfo.imageLinks.thumbnail}" alt="${book.volumeInfo.title}">
                        <h2>${book.volumeInfo.title}</h2>
                        <p>${book.volumeInfo.authors}</p>
                        <p>${book.volumeInfo.publishedDate}</p>
                        <a href="${book.volumeInfo.previewLink}" target="_blank">Preview</a>
                    `;
                    container.appendChild(bookCard);
                })
            }
        })
        .catch(err => {
            console.log(err);
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