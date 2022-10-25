const nameField = document.getElementById("name-info");

function showDialog(users, book, books){
    const userName = book.taken_by.split(' ');
    const userIndex = users.findIndex(e => e.surname === userName[0] && e.name === userName[1]);
    const user = users[userIndex];
    nameField.innerHTML =
        `<h3>${book.taken_by}</h3>
         <p> Книги на руках:</p>
        `;
    for(let i = 0; i < user.taken_books.length; i++){
        nameField.innerHTML +=
            `<p>${books.find(e => e.id === user.taken_books[i]).title}</p>`
    }
    nameField.innerHTML +=
        `<button onclick="closeDialog()">Закрыть</button>`
    nameField.show();
}

function closeDialog(){
    nameField.close();
}
