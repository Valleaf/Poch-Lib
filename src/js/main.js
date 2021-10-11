//Toggle form display on
const addBook = () => {
    document.getElementById('myForm').style.display = "grid";
    document.getElementById('displayFormButton').style.display = "none";
};

const removeForm = () => {
    document.getElementById('myForm').style.display = "none";
    document.getElementById('displayFormButton').style.display = "inline";
}

/**
 * Queries books using google books API searching with author and title as parameters
 */
const queryBooks = async() => {
    // Dans le cas où la recherche ne retourne pas de résultats, le message“ Aucun
    // livre n’ a été trouvé” devra être affichee
    console.log('Entering queryBooks');
    //Stops the page from reloading
    event.preventDefault();
    console.log('Title : ' + document.getElementById('bookTitle').value);
    console.log('Author : ' + document.getElementById('bookAuthor').value);
    //Query
    const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=intitle:\"' + document.getElementById('bookTitle').value + '\" inauthor:\"' + document.getElementById('bookAuthor').value);
    const queryResponse = await response.json();
    let items = queryResponse.items;
    console.log('Reponse complete ');
    document.getElementById('booksQueried').innerHTML = '';
    //Add the books to the page one by one
    //Need to create elements and add them one by one so they are put in a cell
    for (const element of items) {
        console.log(element);
        let src = document.getElementById("booksQueried");
        src.appendChild(createThumbnail(element));

        // $('#booksQueried').append('<div class="cell">' + element.volumeInfo.title + '</div>');
        // $('#booksQueried').append('<div><img src="' + element.volumeInfo.imageLinks.thumbnail + '" alt="Book Cover of ' + element.volumeInfo.title + '/></div> ');
    }
}

/**
 * Creates a thumbnail containing all the information needed
 */
const createThumbnail = (element) => {
    //Initialise a div and nest the image inside
    let div = document.createElement("div");
    div.className = "book-thumbnail-card";
    //Append the title, id, author, Description and then the img
    let card = document.createElement("div");
    card.className = "card";
    let title = document.createElement("div");
    title.className = "card-section h4";
    title.innerText = "Titre : : " + element.volumeInfo.title;
    card.appendChild(title);
    //TODO: APPEND FLAG HERE
    let id = document.createElement("div");
    id.className = "card-section h4";
    id.innerText = "Id : " + element.id;
    card.appendChild(id);
    let authors = document.createElement("div");
    authors.className = "card-section h4";
    authors.innerText = "Auteurs : " + element.volumeInfo.authors.join(',', ' ');
    card.appendChild(authors);
    let description = document.createElement("div");
    description.className = "card-section h4";
    description.innerText = "Description : " + element.volumeInfo.description;
    card.appendChild(description);

    let img = document.createElement("img");
    img.className = 'book-cover';
    //If there is no thumbnail available, use the default image
    if (element.volumeInfo.imageLinks) {
        img.src = element.volumeInfo.imageLinks.thumbnail.replace('&zoom=1&', '&zoom=0&');
    } else img.src = "src/img/unavailable.png";
    //Append the img to the div and return it
    div.appendChild(card);
    div.appendChild(img);
    return div;

}