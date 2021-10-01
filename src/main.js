//Toggle form display on
const addBook = () => {
    document.getElementById('myForm').style.display = "block";
};

const queryBooks = async() => {
    console.log('Entering queryBooks');
    event.preventDefault();
    console.log('Title : ' + document.getElementById('bookTitle').value);
    console.log('Author : ' + document.getElementById('bookAuthor').value);
    const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=intitle:\"' + document.getElementById('bookTitle').value + '\" inauthor:\"' + document.getElementById('bookAuthor').value);
    const queryResponse = await response.json();
    let items = queryResponse.items;
    console.log('Reponse complete ');
    document.getElementById('booksQueried').innerHTML = '';
    for (const element of items) {
        console.log(element);

        document.getElementById('booksQueried').append(element.volumeInfo.title);

    }
}