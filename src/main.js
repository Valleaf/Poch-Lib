//Toggle form display on
const addBook = () => {
    // let form = document.getElementById('myForm');
    // form.appendChild(addForm);
    document.getElementById('myForm').style.display = "block";
};


const handleResponse = (response) => {
    for (let i = 0; i < response.items.length; i++) {
        let element = response.items[i];
        //TODO: ESCAPE HTML
        document.getElementById("booksQueried").innerHTML += "<br>" + item.volumeInfo.title;
    }
}


const queryBooks = async() => {
    event.preventDefault();
    const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=intitle:\"' + document.getElementById('bookTitle').value + '\" inauthor:\"' + document.getElementById('bookAuthor').value);
    const queryResponse = await response.json();
    let items = queryResponse.items;
    console.log('Reponse complete ');
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        console.log(element.volumeInfo);
        document.getElementById('booksQueried').append(element.volumeInfo.title);
    }

    console.log(items[0].volumeInfo);

}