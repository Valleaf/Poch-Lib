//Toggle form display on
const addBook = () => {
  document.getElementById("myForm").style.display = "grid";
  document.getElementById("displayFormButton").style.display = "none";
};
// Toggle form display off
const removeForm = () => {
  document.getElementById("myForm").style.display = "none";
  document.getElementById("displayFormButton").style.display = "inline";
  document.getElementById("js-search-results").style.display = "none";
};

/**
 * Queries books using google books API searching with author and title as parameters
 */
const queryBooks = async () => {
  console.log("Entering queryBooks");

  //Stops the page from reloading
  event.preventDefault();

  //Query
  // Gets the author and title from the form and normalises them
  const response = await fetch(
    'https://www.googleapis.com/books/v1/volumes?q=intitle:"' +
      document
        .getElementById("bookTitle")
        .value.normalize("NFD")
        .replace(/\p{Diacritic}/gu, "") +
      '" inauthor:"' +
      document
        .getElementById("bookAuthor")
        .value.normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
  );

  // If no books are found, display error message
  const queryResponse = await response.json();
  console.log(queryResponse);
  if (queryResponse.totalItems == 0) {
    alert("Aucun livre n’a été trouvé");
    return;
  }
  // If books are found, display them
  let items = queryResponse.items;
  console.log("Reponse complete ");
  document.getElementById("js-search-results").style.display = "inline";
  document.getElementById("booksQueried").innerHTML = "";

  // Add the books to the page one by one
  let handler = new HandleList(null);

  for (const element of items) {
    console.log(element);
    let src = document.getElementById("booksQueried");
    handler.element = element;
    src.appendChild(handler.createThumbnail());
  }
};

/**
 * Adds and element to the pochlist and refreshes the display
 * @param {DOM element} e element to be added to the pochlist 
 * @returns 
 */
const addBookToList = (e) => {

  // Check if the pochlist contains any books and if so get its content
  let library = "";
  if (sessionStorage.getItem("pochlist")) {
    library = sessionStorage.getItem("pochlist");
  }

  let element = e.parentNode.parentNode.outerHTML;

  //Get id of the book
  let idString = element
    .match(/Id : [\w-]+<\/div>/g)
    .toString()
    .match(/[\w-]{4,}/);
  // Check if book is already in the list and if so diplay error message
  if (library.includes(idString)) {
    alert("Vous ne pouvez ajouter deux fois le même livre");
    return;
  }

  // Add the book's id to the library
  if (library == "") {
    library = idString;
  } else {
    library = library + " " + idString;
  }

  // Replace the bookmark icon with a remove icon
  // Replace the addBookToList function with the removeBookFromList function
  element = element
    .replace(
      'class="fas fa-bookmark flag-card"',
      'class="fas fa-trash flag-card"'
    )
    .replace("addBookToList", "removeBookFromList");

  // Add the book to the pochlist
  sessionStorage.setItem("pochlist", library);
  sessionStorage.setItem(idString, element);
  //Refreshes display
  displayToast('Element ajouté');
  displayPochList();
};

/**
 * Removes a book from the pochlist
 * @param {*} e Element to remove from the list
 */
const removeBookFromList = (e) => {
  let library = sessionStorage.getItem("pochlist");
  let idString = e.parentNode.parentNode.outerHTML
  .match(/Id : [\w-]+<\/div>/g)
  .toString()
  .match(/[\w-]{4,}/);
  library = library.replace(idString, "").replace(/  /, " ").trim();
  sessionStorage.setItem("pochlist", library);
  sessionStorage.removeItem(idString);
  displayToast('Element supprimé');
  displayPochList();
};

/**
 * Displays a toast on the page for 3 seconds
 * @param {String} message Message to display
 */
function displayToast(text) {
    // Get the snackbar DIV
    let x = document.getElementById("snackbar");
  
    // Add the "show" class to DIV
    x.className = "show";

    // Add text to the element
    x.innerHTML = text;
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  } 

/**
 * Displays pochlist if there are books stored in the session
 */
const displayPochList = () => {
  if (sessionStorage.getItem("pochlist") != null) {
    document.getElementById("js-stored-list").style.display = "block";
    let library = sessionStorage.getItem("pochlist");

    let src = document.getElementById("pochlist");
    src.innerHTML = "";
    let div = document.createElement("div");
    let books = sessionStorage.getItem("pochlist").split(" ");

    // Add the books to the page one by one
    books.forEach((e) => {
      if (e != "") {
        let bookThumbnail = sessionStorage.getItem(e);
        let book = document.createElement("div");
        book.innerHTML = bookThumbnail;
        src.innerHTML += bookThumbnail;
      }
    });
  }
};

/**
 * This class handles the creation of the book thumbnails and the search results
 * @param {DOM element} element
 */
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
   * @returns {DOM element} thumbnail
   * @memberof HandleList
   */
  createThumbnail = () => {
    //Initialise a div containing all the information
    let div = document.createElement("div");
    div.className = "book-thumbnail-card";

    //Initialise the thumbnail header
    let header = document.createElement("div");
    header.className = "book-thumbnail-element book-thumbnail-header";
    //Append the title to the header
    let title = document.createElement("div");
    title.className = "card-section title-card h4";
    title.innerText = "Titre : " + this.element.volumeInfo.title;
    header.appendChild(title);
    //Append the flag to the header, allowing to add it to the pochlist
    let flag = document.createElement("span");
    flag.className = "fas fa-bookmark flag-card";
    flag.setAttribute("onclick", "addBookToList(this)");
    header.appendChild(flag);
    div.appendChild(header);

    //Initialise the thumbnail body containing the id, author and description
    let id = document.createElement("div");
    id.className = "book-thumbnail-element card-section id-card h4";
    id.innerText = "Id : " + this.element.id;
    div.appendChild(id);
    let authors = document.createElement("div");
    authors.className = "book-thumbnail-element card-section author-card h4";
    // If the author is not specified, display "Auteur non spécifié". Also truncates the author's name if it is too long
    if (this.element.volumeInfo.authors)
      authors.innerText =
        "Auteur : " +
        this.truncateString(this.element.volumeInfo.authors[0], 40);
    else 
        authors.innerText = "Auteur : " + "Aucun auteur trouvé(e)";
    div.appendChild(authors);
    let description = document.createElement("div");
    description.className =
      "book-thumbnail-description card-section description-card h4";
    //   If the description is not specified, display "Aucune description". Also truncates the description if it is too long
    if (this.element.volumeInfo.description)
      description.innerText =
        "Description : " +
        this.truncateString(this.element.volumeInfo.description, 100);
    else
      description.innerText =
        "Description : Information manquante";    
    div.appendChild(description);

    //Initialise the thumbnail footer containing the link to the book's page
    let imgContainer = document.createElement("a");
    imgContainer.href = this.element.volumeInfo.infoLink;
    let img = document.createElement("img");
    imgContainer.className = "book-thumbnail-element book-thumbnail-footer";
    img.className = "book-cover";
    //If there is no thumbnail available, use the default image
    if (this.element.volumeInfo.imageLinks) {
      img.src = this.element.volumeInfo.imageLinks.thumbnail;
    } else img.src = "src/img/unavailable.png";
    //Append the img to the div and return it
    imgContainer.appendChild(img);
    div.appendChild(imgContainer);
    return div;
  };

    /**
     * Truncates a string if it is too long
     * @param {string} str String to truncate
     * @param {number} maxLength Maximum length of the string
     * @returns {string} Truncated string
     * @example
     * truncateString("Hello world", 5) // "Hello"
     * truncateString("Hello world", 10) // "Hello world"
        */
  truncateString(str, num) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }
}
