//Toggle form display on
const addBook = () => {
    // sessionStorage.clear();
    document.getElementById('myForm').style.display = "grid";
    document.getElementById('displayFormButton').style.display = "none";
};

const removeForm = () => {
    document.getElementById('myForm').style.display = "none";
    document.getElementById('displayFormButton').style.display = "inline";
    document.getElementById('js-search-results').style.display = "none";
}

/**
 * Queries books using google books API searching with author and title as parameters
 */
const queryBooks = async() => {
    //TODO: Dans le cas où la recherche ne retourne pas de résultats, le message“ Aucun
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
    document.getElementById('js-search-results').style.display = "inline";
    document.getElementById('booksQueried').innerHTML = '';
    //Add the books to the page one by one
    //Need to create elements and add them one by one so they are put in a cell
    let handler = new HandleList(null);
    sessionStorage.removeItem('items');
    sessionStorage.setItem('items', items);
    for (const element of items) {
        console.log(element);
        let src = document.getElementById("booksQueried");
        handler.element = element;
        src.appendChild(handler.createThumbnail());
    }
}

const addBookToList = (e) => {
        // Le même livre ne pourra pas être ajouté deux foisdans la poch’ liste.Le
        // message“ Vous ne pouvez ajouter deux fois le mêmelivre” devra être a
        let library = '';
        if (sessionStorage.getItem("pochlist")) {
            library = sessionStorage.getItem("pochlist");
        }

        //TODO: Have a sesisonstorage item library with the keys to the book. then each book is an element
        //duplicata - verifier id
        console.log('storage before' + library);
        let element = e.parentNode.parentNode.outerHTML;
        console.log(element);
        let idString = element.match(/Id : \w+<\/div>/g).toString().match(/\w{4,}/);
        console.log('idString ' + idString);
        if (library == '') {
            library = idString;
        } else {
            library = library + ',' + idString;
        }
        sessionStorage.setItem("pochlist", library);
        sessionStorage.setItem(idString, element);
        console.log('storage after' + sessionStorage.getItem("pochlist"));
        displayPochList();
    }
    /**
     * Displays pochlist if there are books stored in the session
     */
const displayPochList = () => {
    //TODO: Display only if books are in
    if(sessionStorage.getItem("pochlist") != null){

    document.getElementById("js-stored-list").style.display = "block";
    let library = sessionStorage.getItem("pochlist");
    console.log('library ' + library);

    let src = document.getElementById("pochlist");
    src.innerHTML = '';
    let div = document.createElement("div");
    let books = sessionStorage.getItem("pochlist").split(',');
    console.log('books' + books);
    books.forEach(e => {
        let bookThumbnail = sessionStorage.getItem(e);
        console.log('bookThumbnail ' + bookThumbnail);
        let book = document.createElement("div");
        book.innerHTML = bookThumbnail;
        div.appendChild(book);
    });
    src.appendChild(div);
    }
}


class HandleList {
    constructor(element) {
        this.element = element;
    }

    get element() {
        return this._element;
    }

    set element(element) {
            this._element = element;
        }
        /**
         * Creates a thumbnail containing all the information needed
         */
    createThumbnail = () => {
        //Initialise a div and nest the image inside
        let div = document.createElement("div");
        div.className = "book-thumbnail-card";
        //Append the title, id, author, Description and then the img
        let card = document.createElement("div");
        card.className = "card";
        let title = document.createElement("div");
        title.className = "card-section h4";
        title.innerText = "Titre : " + this.element.volumeInfo.title;
        card.appendChild(title);
        let flag = document.createElement("button");
        flag.className = '';
        flag.innerHTML = 'Add to list';
        flag.setAttribute("onclick", "addBookToList(this)");
        // flag.addEventListener("click", addBookToList());
        card.appendChild(flag);
        //TODO: APPEND FLAG HERE
        let id = document.createElement("div");
        id.className = "card-section h4";
        id.innerText = "Id : " + this.element.id;
        card.appendChild(id);
        let authors = document.createElement("div");
        authors.className = "card-section h4";
        authors.innerText = "Auteurs : " + this.element.volumeInfo.authors.join(',', ' ');
        card.appendChild(authors);
        let description = document.createElement("div");
        description.className = "card-section h4";
        description.innerText = "Description : " + this.truncateString(this.element.volumeInfo.description, 100);
        card.appendChild(description);
        let img = document.createElement("img");
        img.className = 'book-cover';
        //If there is no thumbnail available, use the default image
        if (this.element.volumeInfo.imageLinks) {
            //HQ Cover but less availability
            img.src = this.element.volumeInfo.imageLinks.thumbnail.replace('&zoom=1&', '&zoom=0&');
        } else img.src = "src/img/unavailable.png";
        //Append the img to the div and return it
        div.appendChild(card);
        div.appendChild(img);
        return div;
    }


    truncateString(str, num) {
        if (str.length <= num) {
            return str
        }
        return str.slice(0, num) + '...'
    }

}