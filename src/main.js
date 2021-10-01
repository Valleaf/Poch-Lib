//Toggle form display on
const addBook = () => {
    document.getElementById('myForm').style.display = "inline";
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
        $('#booksQueried').append('<div class="cell">' + element.volumeInfo.title + '< /div>');
    }
}