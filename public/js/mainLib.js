const table = document.getElementById("table-wrap");
const filter = document.getElementById("filter_menu");

filter.addEventListener("change", () => {
    let filter_mode = filter.options[filter.selectedIndex].value;
    updateBooks(filter_mode);
})

function isOverdue(book){
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    if(!book.is_taken){
        return 0;
    }
    if(book.taken_until.slice(6, 10) < year){
        return 1;
    }
    else if(book.taken_until.slice(3, 5) < month && parseInt(book.taken_until.slice(6, 10)) === year){
        return 1;
    }
    else if(book.taken_until.slice(0, 2) < day && parseInt(book.taken_until.slice(6, 10)) === year && parseInt(book.taken_until.slice(3, 5)) === month){
        return 1;
    }
    else{
        return 0;
    }
}

function htmlForBooks(books){
    let html = ``;
    for(let i = 0; i < books.length; i++){
        html += `<li class="table-row">
                     <div class="col col-1" data-label="№">${i + 1}</div>
                     <div class="col col-2" data-label="Title">${books[i].title}</div>
                     <div class="col col-3" data-label="Author">${books[i].author}</div>
                     <div class="col col-4" data-label="Release date">${books[i].date_release}</div>`;
        if(books[i].is_taken){
            html += `<div class="col col-5" data-label="In stock">Нет в наличии</div>
                    <div class="col col-6" data-label="Taken by">${books[i].taken_by}</div>
                    <div class="col col-7" data-label="Return date">${books[i].taken_until}</div>`;
        }
        else{
            html += `<div class="col col-5" data-label="In stock">Есть в наличии</div>
                    <div class="col col-6" data-label="Taken by"></div>
                    <div class="col col-7" data-label="Return date"></div>`;
        }
        html += `<div class="col col-8" data-label="Actions">
                    <form method="post" action="/books/${books[i].id}"><button type="submit"><i class="fa-solid fa-trash"></i></button></form>
                    <a href="/edit/${books[i].id}"><i class="fa-solid fa-pen-to-square"></i></a>
                 </div>
              </li>`;
    }
    return html;
}

function updateBooks(mode){
    let xhr = new XMLHttpRequest();

    xhr.open('GET', 'books.json', true);
    xhr.send();

    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            let books = JSON.parse(xhr.responseText);
            if(mode === "is taken"){
                books = books.filter(e => e.is_taken === false);
            }
            else if(mode !== "no filter"){
                books = books.filter(e => isOverdue(e));
            }
            table.innerHTML = htmlForBooks(books);
        }
    }
}

