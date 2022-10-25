import express from 'express';
import books from "./data/books.json" assert { type: "json" };
import users from "./data/users.json" assert { type: "json" };
import fs from 'fs';
import { release } from 'os';
import { render } from 'ejs';

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded());

app.set('view engine', 'ejs');

app.listen(3000);

app.get('/', (req, res) => {
    res.render("mainLib", {books: books.books});
});

app.get('/books.json', (req, res) => {
    res.send(books.books);
});

app.post('/books/:id', (req, res) => {
    const id = req.params.id;
    const book = books.books.find(e => e.id === id);
    if(book.is_taken) {
        const userName = book.taken_by.split(' ');
        const userIndex = users.users.findIndex(e => e.surname === userName[0] && e.name === userName[1]);
        users.users[userIndex].taken_books = users.users[userIndex].taken_books.filter(e => parseInt(e) !== parseInt(id));
    }
    books.books = books.books.filter(e => e.id !== id);
    fs.writeFileSync('data/books.json', JSON.stringify(books));
    fs.writeFileSync('data/users.json', JSON.stringify(users));
    res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    const curBook = books.books.find(e => e.id === id);
    res.render("bookEdit", {users: users.users, book: curBook, books: books.books});
});

app.post('/edit/:id', (req, res) => {
    const id = req.params.id;
    const curBookIndex = books.books.findIndex(e => e.id === id);
    books.books[curBookIndex].title = req.body.title;
    books.books[curBookIndex].author = req.body.author;
    books.books[curBookIndex].date_release = req.body.date_release;
    fs.writeFileSync('data/books.json', JSON.stringify(books));
    res.redirect('/');
});

app.post('/return/:id', (req, res) =>{
    const id = req.params.id;
    const curBookIndex = books.books.findIndex(e => e.id === id);
    const curBook = books.books.find(e => e.id === id);
    const userName = curBook.taken_by.split(' ');
    const userIndex = users.users.findIndex(e => e.surname === userName[0] && e.name === userName[1]);
    users.users[userIndex].taken_books = users.users[userIndex].taken_books.filter(e => e !== id);
    books.books[curBookIndex].is_taken = false;
    books.books[curBookIndex].taken_by = '';
    books.books[curBookIndex].taken_until = '';
    fs.writeFileSync('data/books.json', JSON.stringify(books));
    fs.writeFileSync('data/users.json', JSON.stringify(users));
    res.redirect(`/edit/${id}`);
});

app.post('/give/:id', (req, res) => {
    const id = req.params.id;
    const curBookIndex = books.books.findIndex(e => e.id === id);
    const curBook = books.books.find(e => e.id === id);
    const userName = req.body.user_name.split(' ');
    const userIndex = users.users.findIndex(e => e.surname === userName[0] && e.name === userName[1]);
    if(userIndex === -1){
        const newUser = {
            surname: userName[0],
            name: userName[1],
            taken_books: [id]
        };
        users.users.push(newUser);
    }
    else{
        users.users[userIndex].taken_books.push(id);
    }
    books.books[curBookIndex].is_taken = true;
    books.books[curBookIndex].taken_by = req.body.user_name;
    books.books[curBookIndex].taken_until = "01.01.2023";
    fs.writeFileSync('data/books.json', JSON.stringify(books));
    fs.writeFileSync('data/users.json', JSON.stringify(users));
    res.redirect(`/edit/${id}`);
});

app.get('/add/', (req, res) => {
   res.render("bookAdd");
});

app.post('/add', (req, res) => {
   const newBook = {
       id: `${parseInt(books.books[books.books.length - 1].id) + 1}`,
       title: req.body.title,
       author: req.body.author,
       date_release: req.body.date_release,
       is_taken: false,
       taken_by: '',
       taken_until: ''
   };
   books.books.push(newBook);
   fs.writeFileSync('data/books.json', JSON.stringify(books));
   res.redirect('/');
});