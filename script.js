// Initial Element
const addButton = document.getElementById("addBtn");

const modal = document.getElementById("modalForm");
const cancelButton = document.getElementById("cancelButton");

const editModal = document.getElementById("editModalForm");
const cancelEditButton = document.getElementById("cancelEditButton");

const overlay = document.getElementById("overlay");

// Initial Data & Event + Storage Key
const bookData = [];
const RENDER_EVENT = "render_event";
const SEARCH_EVENT = "search_event";
const SAVED_EVENT = "save_data";
const STORAGE_KEY = "book_data";

// DOM Load Event
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookForm");
  const searchInput = document.getElementById("search-input-form");
  const searchButton = document.querySelector(".search-icon-btn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleFormSubmit();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  searchInput.addEventListener("input", () => {
    if (!searchInput.value || searchInput.value == "") {
      document.dispatchEvent(new Event(RENDER_EVENT));
    } else {
      document.dispatchEvent(new Event(SEARCH_EVENT));
    }
  });
  searchButton.addEventListener("click", () => {
    if (!searchInput.value || searchInput.value == "") {
      document.dispatchEvent(new Event(RENDER_EVENT));
    } else {
      document.dispatchEvent(new Event(SEARCH_EVENT));
    }
  });
});

// Modal Form function
function modalForm() {
  overlay.classList.toggle("overlayActive");
  modal.classList.toggle("active");
}

// Handle Tab Mobile Button
const unreadShelf = document.getElementById("unreadShelf");
const readedShelf = document.getElementById("readedShelf");

const tabUnreadButton = document.getElementById("tabUnread");
const tabReadedButton = document.getElementById("tabReaded");

function onTabUnread() {
  readedShelf.classList.remove("tab-readed-active");
  unreadShelf.classList.add("tab-unread-active");
}
function onTabReaded() {
  unreadShelf.classList.remove("tab-unread-active");
  readedShelf.classList.add("tab-readed-active");
}

tabUnreadButton.addEventListener("focus", onTabUnread);
tabReadedButton.addEventListener("focus", onTabReaded);

// Handle Submit Form
function handleFormSubmit() {
  let id = generateId();
  let title = document.getElementById("bookTitle").value;
  let author = document.getElementById("author").value;
  let year = document.getElementById("releaseYear").value;
  let isComplete = document.getElementById("alreadyRead").checked;

  const generateBookObj = generateObj(id, title, author, year, isComplete);
  bookData.push(generateBookObj);
  modalForm();

  document.getElementById("bookTitle").value = "";
  document.getElementById("author").value = "";
  document.getElementById("releaseYear").value = "";
  document.getElementById("alreadyRead").checked = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBookData();
}

// Handle Edit Form
function handleEditFormSubmit(bookId) {
  let editBook = choosenBook(bookId);

  if (!editBook) {
    return "Error, Book not found";
  }

  function editBookSubmit(e) {
    e.preventDefault();

    editBook.title = editTitle.value;
    editBook.author = editAuthor.value;
    editBook.year = editBookYear.value;
    editBook.isComplete = editStatus.checked;

    editModal.classList.remove("active");
    editOverlay.classList.remove("overlayActive");

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBookData();

    editForm.removeEventListener("submit", editBookSubmit);
  }

  const editModal = document.getElementById("editModalForm");
  const editOverlay = document.getElementById("overlay");
  const cancelEditButton = document.getElementById("cancelEditButton");

  editOverlay.classList.add("overlayActive");
  editModal.classList.add("active");
  cancelEditButton.addEventListener("click", () => {
    editOverlay.classList.remove("overlayActive");
    editModal.classList.remove("active");
  });

  let editTitle = document.getElementById("editBookTitle");
  let editAuthor = document.getElementById("editAuthor");
  let editBookYear = document.getElementById("editReleaseYear");
  let editStatus = document.getElementById("editAlreadyRead");

  editTitle.setAttribute("value", editBook.title);
  editAuthor.setAttribute("value", editBook.author);
  editBookYear.setAttribute("value", editBook.year);
  editStatus.setAttribute("checked", editBook.isComplete);

  editTitle.value = `${editBook.title}`;
  editAuthor.value = `${editBook.author}`;
  editBookYear.value = `${editBook.year}`;
  editStatus.checked = editBook.isComplete;

  const editForm = document.getElementById("editBookForm");
  editForm.addEventListener("submit", editBookSubmit);

  console.log(editBook);
}

function choosenBook(id) {
  return bookData.find((book) => book.id == id);
}

function generateId() {
  return +new Date();
}

function generateObj(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year: parseInt(year),
    isComplete,
  };
}

// RENDER EVENT
document.addEventListener(RENDER_EVENT, () => {
  const unreadBookContainer = document.querySelector(".unread-book-container");
  unreadBookContainer.innerHTML = "";

  const readedBookContainer = document.querySelector(".readed-book-container");
  readedBookContainer.innerHTML = "";

  for (const book of bookData) {
    const bookListElement = createBookData(book);

    if (book.isComplete) {
      readedBookContainer.append(bookListElement);
    } else {
      unreadBookContainer.append(bookListElement);
    }
  }
  console.log("Data", bookData);
});

// HANDLE SEARCH EVENT
document.addEventListener(SEARCH_EVENT, () => {
  const searchQuery = document.getElementById("search-input-form").value.toLowerCase();

  const unreadBookContainer = document.querySelector(".unread-book-container");
  unreadBookContainer.innerHTML = "";

  const readedBookContainer = document.querySelector(".readed-book-container");
  readedBookContainer.innerHTML = "";

  const filteredBooks = bookData.filter((book) => {
    return isSubstringInOrder(book.title.toLowerCase(), searchQuery);
  });
  for (const foundBook of filteredBooks) {
    const foundListBook = createBookData(foundBook);

    if (foundBook.isComplete) {
      readedBookContainer.append(foundListBook);
    } else {
      unreadBookContainer.append(foundListBook);
    }
  }
  console.log(filteredBooks);
});

document.addEventListener(SAVED_EVENT, () => {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function isSubstringInOrder(mainString, substring) {
  let substringIndex = 0;

  for (let char of mainString) {
    if (char === substring[substringIndex]) {
      substringIndex++;

      if (substringIndex === substring.length) {
        return true;
      }
    }
  }

  return false;
}

// Create Book Element
function createBookData(bookListData) {
  const bookList = document.createElement("div");
  const infoBook = document.createElement("div");
  const bookStatus = document.createElement("div");
  const statusBookWrapper = document.createElement("div");

  bookList.setAttribute("id", `${bookListData.bookId}`);

  const bookTitle = document.createElement("h3");
  const bookAuthor = document.createElement("p");
  const bookYearRelease = document.createElement("p");

  bookTitle.innerText = bookListData.title;
  bookAuthor.innerText = bookListData.author;
  bookYearRelease.innerText = bookListData.year;

  if (bookListData.isComplete) {
    const bookBtn = document.createElement("button");
    const trashBtn = document.createElement("button");

    bookBtn.innerText = "Selesai dibaca";
    bookBtn.setAttribute("class", "readed-book-btn");
    bookList.setAttribute("class", "readed-list-container");
    infoBook.setAttribute("class", "readed-info-book");
    bookStatus.setAttribute("class", "readed-book-status");
    trashBtn.setAttribute("class", "readed-trash-button");
    statusBookWrapper.setAttribute("class", "status-book-wrapper");

    bookBtn.addEventListener("click", () => {
      changeStatusUnread(bookListData.id);
    });

    trashBtn.addEventListener("click", () => {
      deleteBook(bookListData.id);
    });

    bookStatus.append(bookBtn, trashBtn);
  } else {
    const bookBtn = document.createElement("button");
    const unreadAction = document.createElement("div");
    const editBtn = document.createElement("button");
    const trashBtn = document.createElement("button");

    bookBtn.innerText = "Belum Selesai dibaca";
    bookBtn.setAttribute("class", "unread-book-btn");
    bookList.setAttribute("class", "unread-list-container");
    infoBook.setAttribute("class", "unread-info-book");
    bookStatus.setAttribute("class", "unread-book-status");
    unreadAction.setAttribute("class", "unread-action-btn");
    editBtn.setAttribute("class", "unread-edit-button");
    trashBtn.setAttribute("class", "unread-trash-button");
    statusBookWrapper.setAttribute("class", "status-book-wrapper");

    bookBtn.addEventListener("click", () => {
      changeStatusReaded(bookListData.id);
    });

    editBtn.addEventListener("click", () => {
      handleEditFormSubmit(bookListData.id);
    });

    trashBtn.addEventListener("click", () => {
      deleteBook(bookListData.id);
    });
    unreadAction.append(editBtn, trashBtn);
    bookStatus.append(bookBtn, unreadAction);
  }

  infoBook.append(bookTitle, bookAuthor, bookYearRelease);
  statusBookWrapper.append(bookStatus);
  bookList.append(infoBook, statusBookWrapper);

  return bookList;
}

// Change status to Readed
function changeStatusReaded(statusId) {
  let target = findBook(statusId);

  if (target == null) return;

  target.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBookData();
}

// Change status to Unread
function changeStatusUnread(statusId) {
  let target = findBook(statusId);

  if (target == null) return;

  target.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBookData();
}

function findBook(bookId) {
  for (const book of bookData) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

// Delete Book
function deleteBook(bookId) {
  let target = findBookIndex(bookId);

  if (confirm(`Anda ingin menghapus buku ${bookData[target].title}?`)) {
    if (target === -1) return;

    bookData.splice(target, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBookData();
  }
}

function findBookIndex(id) {
  return bookData.map((item) => item.id).indexOf(id);
}

function saveBookData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookData);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser ini tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      bookData.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Event Listener
addButton.onclick = modalForm;
cancelButton.onclick = modalForm;

// By Rio Al Rasyid
// Semoga dengan project ini, aku mendapatkan sebuah momentum dimana harapan dan cita cita ku terkabulkan
// Tidak ada hal yang mustahil apabila berani mencoba
// Semarang, 28 November 2023 | 12.00
