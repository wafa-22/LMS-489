// ===============================
// GLOBAL UTILITIES
// ===============================
function qs(id) {
  return document.getElementById(id);
}

function showAlert(msg) {
  alert(msg);
}

// ===============================
// NAVBAR SCROLL EFFECT
// ===============================
document.addEventListener("scroll", () => {
  const nav = qs("navbar");
  if (!nav) return;
  window.scrollY > 80 ? nav.classList.add("scrolled") : nav.classList.remove("scrolled");
});

// ===============================
// BOOKS LIST (books.html)
// ===============================
function loadBooks() {
  const container = qs("booksContainer");
  if (!container) return;

  fetch("api/books.php")
    .then(res => res.json())
    .then(books => {
      container.innerHTML = "";

      if (!books || books.length === 0) {
        container.innerHTML = "<p>No books found</p>";
        return;
      }

      books.forEach(b => {
        container.innerHTML += `
          <div class="book-card">
            <img src="images/${b.image ?? 'book1.jpg'}">
            <h3 class="book-title">${b.title}</h3>
            <p class="book-author">${b.author}</p>
            <a href="book_details.html?id=${b.book_id}" class="btn-gold">Details</a>
          </div>
        `;
      });
    })
    .catch(() => showAlert("Failed to load books"));
}

// ===============================
// BOOK DETAILS (book_details.html)
// ===============================
function loadBookDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  fetch(`api/books.php?id=${id}`)
    .then(res => res.json())
    .then(b => {
      if (!b || !b.book_id) {
        showAlert("Book not found");
        return;
      }

      qs("detailsImage").src = `images/${b.image ?? 'book1.jpg'}`;
      qs("detailsTitle").textContent = b.title;
      qs("detailsAuthor").textContent = b.author;
      qs("detailsISBN").textContent = b.isbn;
      qs("detailsCategory").textContent = b.category;
      qs("detailsYear").textContent = b.publication_year;
      qs("detailsStatus").textContent = b.available_copies > 0 ? "Available" : "Not Available";

      qs("borrowBtn").onclick = () => borrowBook(b.book_id);
      qs("reserveBtn").onclick = () => reserveBook(b.book_id);
    })
    .catch(() => showAlert("Error loading book"));
}

// ===============================
// ADD BOOK (add_book.html)
// ===============================
function setupAddBookForm() {
  const form = qs("addBookForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const data = new FormData(form);

    fetch("api/add_book.php", {
      method: "POST",
      body: data
    })
      .then(res => res.json())
      .then(r => {
        if (r.status === "success") {
          showAlert("Book added successfully");
          form.reset();
          window.location.href = "books.html";
        } else {
          showAlert(r.message || "Error adding book");
        }
      })
      .catch(() => showAlert("Server error"));
  });
}

// ===============================
// LOGIN (login.html)
// ===============================
function setupLoginForm() {
  const form = qs("loginForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    fetch("api/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: qs("email").value,
        password: qs("password").value
      })
    })
      .then(res => res.json())
      .then(r => {
        if (r.status === "success") {
          window.location.href =
            r.role === "admin" ? "admin_dashboard.html" : "user_dashboard.html";
        } else {
          showAlert("Invalid login");
        }
      })
      .catch(() => showAlert("Login error"));
  });
}

// ===============================
// REGISTER (register.html)
// ===============================
function setupRegisterForm() {
  const form = qs("registerForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    fetch("api/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: qs("name").value,
        email: qs("email").value,
        password: qs("password").value
      })
    })
      .then(res => res.json())
      .then(r => {
        if (r.status === "success") {
          showAlert("Account created");
          window.location.href = "login.html";
        } else {
          showAlert(r.message || "Register error");
        }
      });
  });
}

// ===============================
// BORROW / RESERVE
// ===============================
function borrowBook(bookId) {
  fetch("api/borrow.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ book_id: bookId })
  })
    .then(res => res.json())
    .then(r => showAlert(r.message))
    .catch(() => showAlert("Borrow error"));
}

function reserveBook(bookId) {
  fetch("api/reserve.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ book_id: bookId })
  })
    .then(res => res.json())
    .then(r => showAlert(r.message))
    .catch(() => showAlert("Reserve error"));
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  loadBooks();
  loadBookDetails();
  setupAddBookForm();
  setupLoginForm();
  setupRegisterForm();
});
