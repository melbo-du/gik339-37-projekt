

/* -- HÄMTA DATA från servern -------------------------------------------------------- */

/* Asynkron funktion, krävs för att kunna använda 'await' */
async function getBooks() {
    /* Skickar förfrågan till servern och väntar på svar */
    const response = await fetch('http://localhost:3000/books');
    /* Omvandlar svaret från förfrågan till JSON, dvs. från rådata till läsbart objekt */
    const books = await response.json();
    /* Skriver ut objektet med böcker i konsollen */
    console.log(books);
    /* Returnerar objektet med böcker */
    return books;
}


/* -- LAGRA ID ----------------------------------------------------------------------- */

/* Hittar div-elementet som innehåller formuläret */
const divForm = document.getElementsByClassName('form')[0];
/* Skapar ett input-element */
const hiddenId = document.createElement('input');
/* Ger input-elementet typen 'hidden' för att den ej ska synas på hemsidan */
hiddenId.setAttribute('type', 'hidden');
/* Ger input-elementet id:et 'bookId' för att kunna lagra id:et för en bok */
hiddenId.setAttribute('id', 'bookId');
/* Infogar input-elementet 'hiddenId' före slutet inuti div-elementet för formuläret */
divForm.insertAdjacentElement('beforeend', hiddenId);


/* -- VISA BÖCKER -------------------------------------------------------------------- */

function showBooks(books) {
  /* Om det finns en gammal lista när en ny bok läggs till tas den gammla listan bort */
  /* Försöker att hitta ett ul-element */
  const existingUl = document.querySelector('ul');
  /* Om ett ul-element hittades */
  if (existingUl) {
    /* Ta bort ul-elementet */
    existingUl.remove();
  }

  /* Skapar ett ul-element, dvs. en unordered list för att hålla list-elementen*/
  const ul = document.createElement('ul');
  /* Lägger till klasser på ul-elementet, är styling från Bootstrap */
  ul.classList.add('row', 'row-cols-1', 'row-cols-sm-2', 'row-cols-md-3', 'g-3')
  /* Infogar ul-elementet efter formulärets slut */
  divForm.insertAdjacentElement('afterend', ul);
  
  /* För varje bok i listan med böcker */
  books.forEach((book) => {
    /* Anropa funktionen 'newBook' */
    newBook(book, ul);
  });
}


/* -- MODALRUTA ---------------------------------------------------------------------- */

/* Hämtar div-elementet som innehåller modalrutan */
const modalElement = document.getElementById('bookModal');
/* Skapar en ny instans av modalruta */
const modalInstance = new bootstrap.Modal(modalElement);
/* Hämtar modalrutans h5-element för titel */
const modalTitle = document.getElementsByClassName('modal-title')[0];
/* Hämtar modalrutans p-element för text */
const modalText = document.querySelector('.modal-body p');


/* -- SKAPA NY BOK ------------------------------------------------------------------- */

function newBook(book, ul) {
  /* Skapar vi ett li-element */
  const li = document.createElement('li');
  /* Li-elementet får bokens specifika id */
  li.setAttribute('id', book.id);

  /* Li-elementet får klass från Bootstrap samt bredd och mellanrum */
  li.classList.add('card', 'shadow');
  li.style.width = '18rem';
  li.style.margin = '1rem';

  /* Li-elementet infogas i ul-elementet före slutet, nyaste boken hamnar längst ner */
  ul.insertAdjacentElement('beforeend', li);

  /* Skapar ett div-element för bokens ikon */
  const divCardIcon = document.createElement('div');
  /* Ger div-elementet stylas i form av ett understreck */
  divCardIcon.style.borderBottom = '0.12rem solid rgba(20, 70, 20, 0.61)';
  /* Infogar div-elementet i början av li-elementet */
  li.insertAdjacentElement('afterbegin', divCardIcon);

  /* Skapar ett div-element för bokens innehåll */
  const divCardBody = document.createElement('div');
  /* Ger boken en klass för styling från Bootstrap */
  divCardBody.classList.add('card-body');
  /* Infogar div-elementet i slutet av li-elementet */
  li.insertAdjacentElement('beforeend', divCardBody);

  /* Anropar funktion för att lägga till en ikon */
  const svg = addIcon(book);
  /* Infogar ikonen i början av div-elementet för ikon */
  divCardIcon.insertAdjacentHTML('afterbegin', svg);

  /* Skapar ett h3-element för bokens titel */
  const h3 = document.createElement('h3');
  /* Hämtar bokens titel från formuläret */
  h3.innerHTML = book.title;
  /* Skapar en sträng av p-element för bokens författare, genre osv. från formuläret */
  const htmlString = `<p> Författare: ${book.author} </p>
                      <p> Genre: ${book.genre} </p>
                      <p> ISBN: ${book.isbn} </p>
                      <p> Utgivningsdatum: ${book.release} </p>`;
  /* Infogar h3-elementet i slutet av div-elementet för bokens innehåll */
  divCardBody.insertAdjacentElement('beforeend', h3);
  /* Infogar p-elementen i slutet av div-elementet för bokens innehåll */
  divCardBody.insertAdjacentHTML('beforeend', htmlString);


  /* -- BUTTON GROUP -- */
  /* Skapar ett div-element för knapparna */
  const buttonGroup = document.createElement('div');
  /* Ger knapparna styling från Bootstrap */
  buttonGroup.classList.add('btn-group');
  /* Infogar div-elementet för knapparna i slutet av div-elementet för bokens innehåll */
  divCardBody.insertAdjacentElement('beforeend', buttonGroup);
  

  /* -- DELETE BUTTON -- */
  /* Skapar ett knapp-element */
  const deleteButton = document.createElement('button');
  /* Ger knappen innehållet 'Ta bort' */
  deleteButton.innerHTML = 'Ta bort';
  /* Ger ta bort-knappen styling från Bootstrap */
  deleteButton.classList.add('btn', 'btn-sm', 'shadow-sm','btn-hover');
  /* Infogar knappen i slutet av div-elementet för knapparna */
  buttonGroup.insertAdjacentElement('beforeend', deleteButton);
  /* Sätter en eventlyssnare på ta bort-knappen som lyssnar efter klick */
  deleteButton.addEventListener('click', () => {
    /* Skickar en förfrågan till servern för att ta bort en bok */
    fetch(`http://localhost:3000/books/${book.id}`, {method: 'DELETE'})
    /* Efter svar från server */
    .then(() => {
      /* Sätter modalrutans titel */
      modalTitle.innerHTML = 'Bok borttagen';
      /* Sätter modalrutans text */
      modalText.innerHTML = 'Boken togs bort från listan!';
      /* Visar modalrutan, i form av feedback till användaren */
      modalInstance.show();

      /* Uppdaterar listan med böcker */
      getBooks().then(showBooks);
    }); 
  });


  /* -- UPDATE BUTTON -- */
  /* Skapar ett knapp-element */
  const updateButton = document.createElement('button');
  /* Ger knappen innehållet 'Ändra' */
  updateButton.innerHTML = 'Ändra';
  /* Ger ändra-knappen styling från Bootstrap */
  updateButton.classList.add('btn', 'btn-sm', 'shadow-sm','btn-hover');
  /* Infogar ändra-knappen i slutet av div-elementet för knappar */
  buttonGroup.insertAdjacentElement('beforeend', updateButton);
  /* Sätter en eventlyssnare på ändra-knappen som lyssnar efter klick */
  updateButton.addEventListener('click', async () => {
    /* Skickar förfrågan till servern och väntar på svar */
    const response = await fetch(`http://localhost:3000/books/${book.id}`);
    /* Omvandlar svaret från förfrågan till JSON, dvs. från rådata till läsbart objekt */
    const selectedBook = await response.json();

    /* Baserat på id:et (den boken som valdes att ändra) sätts värdet i formulärets
       input-fält till innehållet i boken, dvs. när en bok ska ändras så hamnar den 
       "gamla" informationen i fälten för att ändras */
    document.getElementById('bookId').value = selectedBook.id;
    document.getElementById('title').value = selectedBook.title;
    document.getElementById('author').value = selectedBook.author;
    document.getElementById('genre').value = selectedBook.genre;
    document.getElementById('isbn').value = selectedBook.isbn;
    document.getElementById('release').value = selectedBook.release;

    /* Hämtar h2-elementet */
    const h2 = document.querySelectorAll('h2')[0];
    /* Sätter h2-elementet till 'Uppdatera bok', gör att titeln ändras för användaren */
    h2.innerHTML = 'Uppdatera bok';

    /* Hämtar knapp-elementet för att skicka bok */
    const submitUpdate = document.getElementById('submitButton');
    /* Sätter knapp-elementets värde till 'Uppdatera bok, gör att knappen ändras för
       användaren */
    submitUpdate.value = 'Uppdatera';

    /* Hämtar label för submit-knappen */
    const label = document.getElementById('submitLabel');
    /* Sätter label-elementet till 'Uppdatera bok', gör att label:en för submit-knappen
       ändras för användaren */
    label.innerHTML = 'Uppdatera bok:';

    /* Scrollar längst upp på sidan, till formuläret */
    window.scrollTo({ top: 0, behavior: 'smooth'});
  });
}
/* Uppdaterar listan med böcker */
getBooks().then(showBooks);


/* -- SUBMIT BUTTON ------------------------------------------------------------------ */

function submitForm(e) {
  /* Sparar värdet i formulärets input-fält i variabler */
  const bookId = document.getElementById('bookId').value;
  const titleContent = document.getElementById('title').value;
  const authorContent = document.getElementById('author').value;
  const genreContent = document.getElementById('genre').value;
  const isbnContent = document.getElementById('isbn').value;
  const releaseContent = document.getElementById('release').value;

  /* Skapar ett objekt med bokens information */
  const book = { title: titleContent, author: authorContent, genre: genreContent, isbn: isbnContent, release: releaseContent };
  
  /* Anger att metoden ska vara POST, dvs. att skapa en bok */
  let method = 'POST';
  /* Om det redan finns ett existerande id */
  if (bookId) {
    /* Ska metoden vara PUT, dvs. att uppdatera en bok */
    method = 'PUT';
    /* Det gamla id:et tilldelas till bok-objektets id */
    book.id = bookId;
  }
  
  /* Skickar en förfrågan till servern */
  fetch('http://localhost:3000/books', {
    /* Metoden styrs av huruvida det fanns ett id eller inte */
    method: method,
    /* Skickar bokens data i JSON-format */
    body: JSON.stringify(book),
    /* Beskriver "paketets" innehåll */
    headers: {
      'Content-Type': 'Application/json'
    }
  /* Efter svar från servern */
  }).then(() => {
    /* Tömmer alla input-fält i formuläret genom en tom sträng */
    document.getElementById('bookId').value = '';
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('genre').value = '';
    document.getElementById('isbn').value = '';
    document.getElementById('release').value = '';
    /* Hämtar submit-knappen */
    const submitButton = document.getElementById('submitButton');
    /* Återställer värdet till 'Skicka' från 'Uppdatera bok' */
    submitButton.value = 'Skicka';

    /* Om metoden var 'PUT' */
    if (method === 'PUT') {
      /* Modalrutans titel och text uppdateras */
      modalTitle.innerHTML = 'Boken uppdaterades';
      modalText.innerHTML = `"${book.title}" har uppdaterats!`;
    /* Annars, dvs. om metoden var 'POST' */
    } else {
      /* Modalrutans titel och text uppdateras */
      modalTitle.innerHTML = 'Skapad bok';
      modalText.innerHTML = 'Boken lades till i listan!';
    }
    /* Modalrutan visas för användaren */
    modalInstance.show();

    /* Uppdaterar listan med böcker */
    getBooks().then(showBooks);
  });  
}
/* Hämtar submit-knappen */
const submitButton = document.getElementById('submitButton');
/* Sätter en eventlyssnare på submit-knappen som lyssnar efter 'click' och anropar 
   metoden 'submitForm' */
submitButton.addEventListener('click', submitForm);


/* -- STYRA GRAFISKT ----------------------------------------------------------------- */

function addIcon(book) {
  /* Beroende på vilken genre boken har får den specifik ikon */
  if (book.genre == 'Resor') {
    /* Skapar svg-element med specifik ikon, från Bootstrap */
    const svg = `<svg class="card-img-top" style="margin-block: 2rem" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="rgba(20, 70, 20, 0.851)" class="bi bi-airplane-fill" viewBox="0 0 16 16">
               <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849"/>
               </svg>`;
    /* Returnerar ikonen */
    return svg;
  } 
  /* Resterande ikoner för respektive genre, samma logik som ovan */
  else if (book.genre == 'Romantik') {
    const svg = `<svg class="card-img-top" style="margin-block: 2rem" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="rgba(20, 70, 20, 0.851)" class="bi bi-arrow-through-heart-fill" viewBox="0 0 16 16">
                 <path fill-rule="evenodd" d="M2.854 15.854A.5.5 0 0 1 2 15.5V14H.5a.5.5 0 0 1-.354-.854l1.5-1.5A.5.5 0 0 1 2 11.5h1.793l3.103-3.104a.5.5 0 1 1 .708.708L4.5 12.207V14a.5.5 0 0 1-.146.354zM16 3.5a.5.5 0 0 1-.854.354L14 2.707l-1.006 1.006c.236.248.44.531.6.845.562 1.096.585 2.517-.213 4.092-.793 1.563-2.395 3.288-5.105 5.08L8 13.912l-.276-.182A24 24 0 0 1 5.8 12.323L8.31 9.81a1.5 1.5 0 0 0-2.122-2.122L3.657 10.22a9 9 0 0 1-1.039-1.57c-.798-1.576-.775-2.997-.213-4.093C3.426 2.565 6.18 1.809 8 3.233c1.25-.98 2.944-.928 4.212-.152L13.292 2 12.147.854A.5.5 0 0 1 12.5 0h3a.5.5 0 0 1 .5.5z"/>
                 </svg>`;
    return svg;
  }
  else if (book.genre == 'Vetenskap') {
    const svg = `<svg class="card-img-top" style="margin-block: 2rem" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="rgba(20, 70, 20, 0.851)" class="bi bi-flask-fill" viewBox="0 0 16 16">
             <path d="M11.5 0a.5.5 0 0 1 0 1H11v5.358l4.497 7.36c.099.162.16.332.192.503l.013.063.008.083q.006.053.007.107l-.003.09q-.001.047-.005.095-.006.053-.017.106l-.016.079q-.012.049-.028.096l-.028.086a1.5 1.5 0 0 1-.17.322 1.5 1.5 0 0 1-.395.394q-.04.028-.082.054-.045.026-.095.049l-.073.035-.09.033q-.05.02-.103.034-.04.01-.08.017-.053.012-.108.021l-.006.002-.202.013H1.783l-.214-.015a1.503 1.503 0 0 1-1.066-2.268L5 6.359V1h-.5a.499.499 0 0 1-.354-.854A.5.5 0 0 1 4.5 0zm.5 12a.5.5 0 0 0 0 1h1.885l-.61-1zm-1-2a.5.5 0 0 0 0 1h1.664l-.612-1zm-1-2a.5.5 0 0 0 0 1h1.441l-.61-1zM9 6a.5.5 0 0 0 0 1h1.22l-.147-.24A.5.5 0 0 1 10 6.5V6zm0-2a.5.5 0 0 0 0 1h1V4zm0-2a.5.5 0 0 0 0 1h1V2z"/>
             </svg>`;
    return svg;
  }
  else if (book.genre == 'Skräck') {
    const svg = `<svg class="card-img-top" style="margin-block: 2rem" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="rgba(20, 70, 20, 0.851)" class="bi bi-emoji-grimace" viewBox="0 0 16 16">
                 <path d="M7 6.25c0 .69-.448 1.25-1 1.25s-1-.56-1-1.25S5.448 5 6 5s1 .56 1 1.25m3 1.25c.552 0 1-.56 1-1.25S10.552 5 10 5s-1 .56-1 1.25.448 1.25 1 1.25m2.98 3.25A1.5 1.5 0 0 1 11.5 12h-7a1.5 1.5 0 0 1-1.48-1.747v-.003A1.5 1.5 0 0 1 4.5 9h7a1.5 1.5 0 0 1 1.48 1.747zm-8.48.75h.25v-.75H3.531a1 1 0 0 0 .969.75m7 0a1 1 0 0 0 .969-.75H11.25v.75zm.969-1.25a1 1 0 0 0-.969-.75h-.25v.75zM4.5 9.5a1 1 0 0 0-.969.75H4.75V9.5zm1.75 2v-.75h-1v.75zm.5 0h1v-.75h-1zm1.5 0h1v-.75h-1zm1.5 0h1v-.75h-1zm1-2h-1v.75h1zm-1.5 0h-1v.75h1zm-1.5 0h-1v.75h1zm-1.5 0h-1v.75h1z"/>
                 <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m0-1A7 7 0 1 1 8 1a7 7 0 0 1 0 14"/>
                 </svg>`;
    return svg;
  }
  else if (book.genre == 'Hälsa') {
    const svg = `<svg class="card-img-top" style="margin-block: 2rem" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="rgba(20, 70, 20, 0.61)" class="bi bi-lungs-fill" viewBox="0 0 16 16">
                 <path d="M8 1a.5.5 0 0 1 .5.5v5.243L9 7.1V4.72C9 3.77 9.77 3 10.72 3c.524 0 1.023.27 1.443.592.431.332.847.773 1.216 1.229.736.908 1.347 1.946 1.58 2.48.176.405.393 1.16.556 2.011.165.857.283 1.857.24 2.759-.04.867-.232 1.79-.837 2.33-.67.6-1.622.556-2.741-.004l-1.795-.897A2.5 2.5 0 0 1 9 11.264V8.329l-1-.715-1 .715V7.214c-.1 0-.202.03-.29.093l-2.5 1.786a.5.5 0 1 0 .58.814L7 8.329v2.935A2.5 2.5 0 0 1 5.618 13.5l-1.795.897c-1.12.56-2.07.603-2.741.004-.605-.54-.798-1.463-.838-2.33-.042-.902.076-1.902.24-2.759.164-.852.38-1.606.558-2.012.232-.533.843-1.571 1.579-2.479.37-.456.785-.897 1.216-1.229C4.257 3.27 4.756 3 5.28 3 6.23 3 7 3.77 7 4.72V7.1l.5-.357V1.5A.5.5 0 0 1 8 1m3.21 8.907a.5.5 0 1 0 .58-.814l-2.5-1.786A.5.5 0 0 0 9 7.214V8.33z"/>
                 </svg>`;
    return svg;
  }
  else if (book.genre == 'Studier') {
    const svg = `<svg class="card-img-top" style="margin-block: 2rem" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="rgba(20, 70, 20, 0.61)" class="bi bi-mortarboard-fill" viewBox="0 0 16 16">
                 <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917z"/>
                 <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466z"/>
                 </svg>`;
    return svg;
  }
  else if (book.genre == 'Självbiografi') {
    const svg = `<svg class="card-img-top" style="margin-block: 2rem" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="rgba(20, 70, 20, 0.61)" class="bi bi-person-fill" viewBox="0 0 16 16">
                 <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                 </svg>`;
    return svg;
  }
  else if (book.genre == 'Deckare') {
    const svg = `<svg class="card-img-top" style="margin-block: 2rem" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="rgba(20, 70, 20, 0.61)" class="bi bi-search" viewBox="0 0 16 16">
                 <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                 </svg>`;
    return svg;
  }
  else if (book.genre == 'Språk') {
    const svg = `<svg class="card-img-top" style="margin-block: 2rem" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="rgba(20, 70, 20, 0.61)" class="bi bi-translate" viewBox="0 0 16 16">
                 <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z"/>
                 <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31"/>
                 </svg>`;
    return svg;
  } 
}