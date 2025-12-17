// ============================================
// SIMPLE LOCAL DATABASE (localStorage) & UTILITIES
// ============================================

const LS_KEYS = {
    users: 'ul_users',
    books: 'ul_books',
    borrowings: 'ul_borrowings',
    reservations: 'ul_reservations',
    settings: 'ul_settings',
    notifications: 'ul_notifications'
};

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function load(key) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
}

function initializeDB() {
    // Users
    if (!load(LS_KEYS.users)) {
        const users = [
            { id: 1, email: 'user@example.com', password: 'user123', role: 'user', name: 'John User', type: 'member' },
            { id: 2, email: 'admin@example.com', password: 'admin123', role: 'admin', name: 'Admin User', type: 'admin' },
            { id: 3, email: 'staff@example.com', password: 'staff123', role: 'librarian', name: 'Library Staff', type: 'staff' }
        ];
        save(LS_KEYS.users, users);
    }

    // Books
    if (!load(LS_KEYS.books)) {
        const defaultBooks = [
            { id: 1, title: 'The Golden Era', author: 'Author A', isbn: '111', category: 'Literature', publisher: 'Pub A', year: 2010, language: 'English', cover: 'images/book1.jpg', status: 'available' },
            { id: 2, title: 'Digital Frontiers', author: 'Author B', isbn: '112', category: 'Technology', publisher: 'Pub B', year: 2018, language: 'English', cover: 'images/book2.jpg', status: 'available' },
            { id: 3, title: 'AI Revolution', author: 'Author C', isbn: '113', category: 'Technology', publisher: 'Pub C', year: 2020, language: 'English', cover: 'images/book3.jpg', status: 'available' },
            { id: 4, title: 'Mystery of Time', author: 'Author D', isbn: '114', category: 'Fiction', publisher: 'Pub D', year: 2012, language: 'English', cover: 'images/book4.jpg', status: 'available' },
            { id: 5, title: 'The Lost Library', author: 'Author E', isbn: '115', category: 'Mystery', publisher: 'Pub E', year: 2015, language: 'English', cover: 'images/book5.jpg', status: 'available' },
            { id: 6, title: 'Hidden Worlds', author: 'Author F', isbn: '116', category: 'Fantasy', publisher: 'Pub F', year: 2019, language: 'English', cover: 'images/book6.jpg', status: 'available' },
            { id: 7, title: 'Future Codes', author: 'Author G', isbn: '117', category: 'Technology', publisher: 'Pub G', year: 2021, language: 'English', cover: 'images/book7.jpg', status: 'available' },
            { id: 8, title: 'Beyond Reality', author: 'Author H', isbn: '118', category: 'Sci-Fi', publisher: 'Pub H', year: 2017, language: 'English', cover: 'images/book8.jpg', status: 'available' },
            { id: 9, title: 'Secrets of Knowledge', author: 'Author I', isbn: '119', category: 'Education', publisher: 'Pub I', year: 2009, language: 'English', cover: 'images/book9.jpg', status: 'available' },
            { id: 10, title: 'Art of Learning', author: 'Author J', isbn: '120', category: 'Education', publisher: 'Pub J', year: 2011, language: 'English', cover: 'images/book10.jpg', status: 'available' }
        ];
        save(LS_KEYS.books, defaultBooks);
    }

    // Borrowings and reservations
    if (!load(LS_KEYS.borrowings)) {
        const now = new Date();
        // sample borrowed book: book 1 borrowed by user 1, due in 7 days
        const borrowedAt = now.toISOString();
        const dueAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
        save(LS_KEYS.borrowings, [{ id: 1, bookId: 1, userId: 1, borrowedAt, dueAt, returnedAt: null }]);
        // update book status
        const books = load(LS_KEYS.books) || [];
        const b = books.find(x => x.id === 1);
        if (b) { b.status = 'issued'; b.issuedTo = 1; save(LS_KEYS.books, books); }
    }
    if (!load(LS_KEYS.reservations)) {
        const now = new Date().toISOString();
        // small sample reservations for demo (ensure at least 2 for user1)
        save(LS_KEYS.reservations, [
            { id: 1, bookId: 3, userId: 1, reservedAt: now, fulfilledAt: null },
            { id: 2, bookId: 5, userId: 1, reservedAt: now, fulfilledAt: null },
            { id: 3, bookId: 2, userId: 3, reservedAt: now, fulfilledAt: now }
        ]);
    }

    // Settings (borrowing limits/durations/fines)
    if (!load(LS_KEYS.settings)) {
        const settings = {
            borrowLimits: { member: 3, staff: 5, librarian: 10 },
            borrowDurationDays: { member: 14, staff: 28, librarian: 56 },
            finePerDay: 1.0,
            overdueGraceDays: 0
        };
        save(LS_KEYS.settings, settings);
    }

    if (!load(LS_KEYS.notifications)) save(LS_KEYS.notifications, []);
}

// Seed demo data on demand
function seedDemoData() {
    if (!confirm('Seed demo data? This will overwrite current demo records in LocalStorage.')) return;
    // Users
    const users = [
        { id: 1, email: 'user1@example.com', password: 'user123', role: 'user', name: 'John User', type: 'member' },
        { id: 2, email: 'admin@example.com', password: 'admin123', role: 'admin', name: 'Admin User', type: 'admin' },
        { id: 3, email: 'staff@example.com', password: 'staff123', role: 'librarian', name: 'Library Staff', type: 'staff' },
        { id: 4, email: 'user2@example.com', password: 'user123', role: 'user', name: 'Sarah Student', type: 'member' }
    ];
    save(LS_KEYS.users, users);
    // set current user to first demo user for quick preview
    localStorage.setItem('currentUser', JSON.stringify({ id: users[0].id, email: users[0].email, role: users[0].role, name: users[0].name, loginTime: new Date().toISOString() }));

    // Books
    const books = [
        { id: 1, title: 'The Golden Era', author: 'Author A', isbn: '111', category: 'Literature', publisher: 'Pub A', year: 2010, language: 'English', cover: 'images/book1.jpg', status: 'available' },
        { id: 2, title: 'Digital Frontiers', author: 'Author B', isbn: '112', category: 'Technology', publisher: 'Pub B', year: 2018, language: 'English', cover: 'images/book2.jpg', status: 'available' },
        { id: 3, title: 'AI Revolution', author: 'Author C', isbn: '113', category: 'Technology', publisher: 'Pub C', year: 2020, language: 'English', cover: 'images/book3.jpg', status: 'available' },
        { id: 4, title: 'Mystery of Time', author: 'Author D', isbn: '114', category: 'Fiction', publisher: 'Pub D', year: 2012, language: 'English', cover: 'images/book4.jpg', status: 'available' },
        { id: 5, title: 'The Lost Library', author: 'Author E', isbn: '115', category: 'Mystery', publisher: 'Pub E', year: 2015, language: 'English', cover: 'images/book5.jpg', status: 'available' },
        { id: 6, title: 'Hidden Worlds', author: 'Author F', isbn: '116', category: 'Fantasy', publisher: 'Pub F', year: 2019, language: 'English', cover: 'images/book6.jpg', status: 'available' }
    ];
    save(LS_KEYS.books, books);

    // Borrowings (mark two books borrowed by user1)
    const now = new Date();
    const borrowedAt = now.toISOString();
    const dueAt = new Date(now.getTime() + (7 * 24*60*60*1000)).toISOString();
    const borrowings = [
        { id: 1, bookId: 1, userId: 1, borrowedAt, dueAt, returnedAt: null },
        { id: 2, bookId: 3, userId: 1, borrowedAt, dueAt, returnedAt: null }
    ];
    save(LS_KEYS.borrowings, borrowings);
    // update status for borrowed books
    const books2 = getBooks();
    [1,3].forEach(id => {
        const b = books2.find(x => x.id === id);
        if (b) { b.status = 'issued'; b.issuedTo = 1; }
    });
    saveBooks(books2);

    // Reservations
    const reservations = [
        { id: 1, bookId: 2, userId: 4, reservedAt: new Date().toISOString(), fulfilledAt: null },
        { id: 2, bookId: 3, userId: 3, reservedAt: new Date().toISOString(), fulfilledAt: new Date().toISOString() },
        { id: 3, bookId: 4, userId: 1, reservedAt: new Date().toISOString(), fulfilledAt: null }
    ];
    save(LS_KEYS.reservations, reservations);

    // Notifications
    save(LS_KEYS.notifications, [
        { id: 1, toUserId: 1, message: 'Reminder: Please return your borrowed book soon.', createdAt: new Date().toISOString() }
    ]);

    alert('Demo data seeded. Reloading page...');
    window.location.reload();
}

// Reset app data to defaults
function resetToDefaults() {
    if (!confirm('Reset all app data to defaults? This will clear LocalStorage for the app.')) return;
    Object.values(LS_KEYS).forEach(k => localStorage.removeItem(k));
    localStorage.removeItem('currentUser');
    initializeDB();
    alert('Reset complete. Reloading page...');
    window.location.reload();
}

// Create fake reservations for logged-in user
function createFakeReservations(count = 2) {
    const user = getCurrentUser();
    if (!user) { showToast('Please login to create reservations'); return; }
    const books = getBooks();
    const reservations = getReservations();

    // candidates: books not already reserved by this user
    const candidates = books.filter(b => !reservations.find(r => r.bookId === b.id && r.userId === user.id && !r.fulfilledAt));
    if (candidates.length === 0) { showToast('No eligible books to reserve'); return; }

    // shuffle and pick
    const picked = candidates.sort(() => 0.5 - Math.random()).slice(0, count);
    let created = 0;
    picked.forEach(b => {
        const res = reserveBook(b.id, user.id);
        if (res.ok) created++;
    });
    if (created > 0) {
        showToast(`Created ${created} reservation${created>1 ? 's' : ''}`);
        renderUserDashboard();
        renderBooksGrid();
    } else {
        showToast('No reservations created');
    }
}

// Utility to generate ID
function generateId(collectionKey) {
    const list = load(collectionKey) || [];
    let max = 0;
    list.forEach(i => { if (i.id && i.id > max) max = i.id; });
    return max + 1;
}

// CRUD helpers
function getUsers() { return load(LS_KEYS.users) || []; }
function saveUsers(list) { save(LS_KEYS.users, list); }
function getBooks() { return load(LS_KEYS.books) || []; }
function saveBooks(list) { save(LS_KEYS.books, list); }
function getBorrowings() { return load(LS_KEYS.borrowings) || []; }
function saveBorrowings(list) { save(LS_KEYS.borrowings, list); }
function getReservations() { return load(LS_KEYS.reservations) || []; }
function saveReservations(list) { save(LS_KEYS.reservations, list); }
function getSettings() { return load(LS_KEYS.settings); }
function saveSettings(s) { save(LS_KEYS.settings, s); }
function getNotifications() { return load(LS_KEYS.notifications) || []; }
function saveNotifications(list) { save(LS_KEYS.notifications, list); }

// book management
function addBook(book) {
    const books = getBooks();
    book.id = generateId(LS_KEYS.books);
    books.push(book);
    saveBooks(books);
    return book;
}

function updateBook(book) {
    const books = getBooks().map(b => b.id === book.id ? book : b);
    saveBooks(books);
}

function removeBook(bookId) {
    const books = getBooks().filter(b => b.id !== bookId);
    saveBooks(books);
}

function findBook(bookId) {
    return getBooks().find(b => b.id === (typeof bookId === 'string' ? parseInt(bookId) : bookId));
}

// Users
function addUser(user) {
    const users = getUsers();
    user.id = generateId(LS_KEYS.users);
    users.push(user);
    saveUsers(users);
    return user;
}

function updateUser(user) {
    const users = getUsers().map(u => u.id === user.id ? user : u);
    saveUsers(users);
}

function findUserByEmail(email) {
    return getUsers().find(u => u.email.toLowerCase() === (email || '').toLowerCase());
}

// Borrowing logic
function borrowBook(bookId, userId) {
    const settings = getSettings();
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const borrowings = getBorrowings();
    const userBorrowCount = borrowings.filter(b => b.userId === userId && !b.returnedAt).length;
    const limit = settings.borrowLimits[user.type] || 3;
    if (userBorrowCount >= limit) return { ok: false, reason: 'Borrow limit reached' };

    const book = findBook(bookId);
    if (!book) return { ok: false, reason: 'Book not found' };
    if (book.status !== 'available') return { ok: false, reason: 'Book not available' };

    const loanDays = settings.borrowDurationDays[user.type] || settings.borrowDurationDays.member;
    const now = new Date();
    const dueAt = new Date(now.getTime() + loanDays * 24 * 60 * 60 * 1000).toISOString();
    borrowings.push({ id: generateId(LS_KEYS.borrowings), bookId, userId, borrowedAt: now.toISOString(), dueAt, returnedAt: null });
    saveBorrowings(borrowings);
    // update book status
    book.status = 'issued';
    book.issuedTo = userId;
    updateBook(book);
    return { ok: true };
}

function returnBook(bookId, userId) {
    const borrowings = getBorrowings();
    const borrow = borrowings.find(b => b.bookId === bookId && b.userId === userId && !b.returnedAt);
    if (!borrow) return { ok: false, reason: 'No active borrowing found' };
    borrow.returnedAt = new Date().toISOString();
    saveBorrowings(borrowings);

    const book = findBook(bookId);
    if (!book) return { ok: false, reason: 'Book not found' };
    // Update status
    book.status = 'available';
    delete book.issuedTo;
    updateBook(book);

    // Calculate fines
    const settings = getSettings();
    const due = new Date(borrow.dueAt);
    const returned = new Date(borrow.returnedAt);
    let fine = 0;
    if (returned > due) {
        const diffDays = Math.ceil((returned - due) / (24 * 60 * 60 * 1000));
        fine = diffDays * settings.finePerDay;
    }

    // process reservations for the book
    processReservations(bookId);

    return { ok: true, fine };
}

// Reservations (FIFO queue)
function reserveBook(bookId, userId) {
    const book = findBook(bookId);
    if (!book) return { ok: false, reason: 'Book not found' };
    const reservations = getReservations();
    if (reservations.find(r => r.bookId === bookId && r.userId === userId && !r.fulfilledAt)) return { ok:false, reason: 'Already reserved' };
    const now = new Date().toISOString();
    reservations.push({ id: generateId(LS_KEYS.reservations), bookId, userId, reservedAt: now, fulfilledAt: null });
    saveReservations(reservations);
    return { ok: true };
}

function processReservations(bookId) {
    const reservations = getReservations();
    const book = findBook(bookId);
    if (!book) return;
    const queue = reservations.filter(r => r.bookId === bookId && !r.fulfilledAt);
    if (queue.length === 0) return;
    // assign to first user but keep as reserved until they pick it up - here we simulate notifying them
    const first = queue[0];
    first.fulfilledAt = new Date().toISOString();
    saveReservations(reservations);
    // notify
    pushNotification({ toUserId: first.userId, message: `Your reserved book '${book.title}' is now available. Please pick it up within 2 days.` });
}

function renewBook(bookId, userId) {
    const borrowings = getBorrowings();
    const borrow = borrowings.find(b => b.bookId === bookId && b.userId === userId && !b.returnedAt);
    if (!borrow) return { ok: false, reason: 'No active borrowing' };
    // ensure no reservation queue
    const reservations = getReservations().filter(r => r.bookId === bookId && !r.fulfilledAt);
    if (reservations.length > 0) return { ok: false, reason: 'Cannot renew - reservations pending' };
    const user = getUsers().find(u => u.id === userId);
    const settings = getSettings();
    const additionalDays = settings.borrowDurationDays[user.type] || 14;
    borrow.dueAt = new Date(new Date(borrow.dueAt).getTime() + additionalDays * 24 * 60 * 60 * 1000).toISOString();
    saveBorrowings(borrowings);
    return { ok: true, newDueAt: borrow.dueAt };
}

// notifications
function pushNotification(notification) {
    const notifications = getNotifications();
    notification.id = generateId(LS_KEYS.notifications);
    notification.createdAt = new Date().toISOString();
    notifications.push(notification);
    saveNotifications(notifications);
}

// Reports
function generateReport() {
    const books = getBooks();
    const borrowings = getBorrowings();
    const reservations = getReservations();
    const settings = getSettings();
    const now = new Date();

    const borrowedCount = borrowings.filter(b => !b.returnedAt).length;
    const overdue = borrowings.filter(b => !b.returnedAt && new Date(b.dueAt) < now);
    const reserved = reservations.filter(r => !r.fulfilledAt).length;
    const mostBorrowed = (() => {
        const map = {};
        borrowings.forEach(b => { map[b.bookId] = (map[b.bookId] || 0) + 1; });
        const arr = Object.keys(map).map(k => ({ bookId: parseInt(k), count: map[k] }));
        arr.sort((a,b)=>b.count-a.count);
        return arr.slice(0,5).map(r => ({ book: findBook(r.bookId), count: r.count }));
    })();

    // fines calculation
    let finesCollected = 0;
    let finesOutstanding = 0;
    borrowings.forEach(b => {
        const finePerDay = settings.finePerDay || 1;
        if (b.returnedAt) {
            const due = new Date(b.dueAt); const ret = new Date(b.returnedAt);
            if (ret > due) {
                const days = Math.ceil((ret - due) / (24*60*60*1000));
                finesCollected += days * finePerDay;
            }
        } else {
            const due = new Date(b.dueAt);
            if (due < now) {
                const days = Math.ceil((now - due) / (24*60*60*1000));
                finesOutstanding += days * finePerDay;
            }
        }
    });

    return { totalBooks: books.length, borrowedCount, overdueCount: overdue.length, reservedCount: reserved, mostBorrowed, finesCollected, finesOutstanding };
}

// UI helpers
function showToast(message, timeout = 2500) {
    let toast = document.createElement('div');
    toast.className = 'site-toast';
    toast.textContent = message;
    Object.assign(toast.style, {position: 'fixed', bottom: '20px', right: '20px', padding: '12px 18px', background: '#2a1e16', color: '#e6c08b', borderRadius: '8px', zIndex: 9999, boxShadow: '0 6px 18px rgba(0,0,0,0.4)'});
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, timeout);
}

function renderBooksGrid(search = '') {
    const nodes = document.querySelectorAll('.books-grid');
    if (!nodes || nodes.length === 0) return;
    const books = getBooks();
    const q = (search || '').trim().toLowerCase();
    const filtered = q ? books.filter(b => (b.title+b.author+b.category+b.isbn).toLowerCase().includes(q)) : books;
    nodes.forEach(node => {
        node.innerHTML = '';
        filtered.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';
            const statusBadge = book.status ? `<div style="position:absolute;right:14px;top:12px;background:rgba(0,0,0,0.4);padding:6px 10px;border-radius:8px;font-size:12px;color:#d0a873;">${book.status}</div>` : '';
            card.innerHTML = `
                <img src="${book.cover || 'images/book1.jpg'}" alt="${book.title}">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <p style="opacity:0.8;">${book.category} • ${book.year}</p>
                <a href="book_details.html?id=${book.id}" class="btn-gold" style="display:block; text-align:center; margin-top:10px;">Details</a>
                ${statusBadge}
            `;
            // admin controls
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.role === 'admin') {
                const adminControls = document.createElement('div');
                adminControls.style.display = 'flex'; adminControls.style.gap = '8px'; adminControls.style.marginTop = '8px';
                const editBtn = document.createElement('button'); editBtn.className = 'btn-gold'; editBtn.textContent = 'Edit'; editBtn.style.padding = '8px'; editBtn.onclick = () => { window.location.href = `add_book.html?edit=${book.id}`; };
                const deleteBtn = document.createElement('button'); deleteBtn.className = 'btn-gold'; deleteBtn.textContent = 'Delete'; deleteBtn.style.background = '#6a5845'; deleteBtn.style.padding = '8px';
                deleteBtn.onclick = () => { if (confirm('Delete this book?')) { removeBook(book.id); renderBooksGrid(); } };
                adminControls.appendChild(editBtn); adminControls.appendChild(deleteBtn);
                card.appendChild(adminControls);
            }
            node.appendChild(card);
        });
    });
}

function displayNotifications() {
    const notices = getNotifications();
    const currentUser = getCurrentUser();
    if (!notices || !currentUser) return;
    const userNotices = notices.filter(n => !n.toUserId || n.toUserId === currentUser.id);
    if (userNotices.length === 0) return;
    userNotices.forEach(n => showToast(n.message, 6000));
}

// Book details actions
function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function setupBookDetailsActions() {
    const id = getQueryParam('id');
    if (!id) return;
    const book = findBook(id);
    if (!book) return;
    const primary = document.getElementById('actionPrimary');
    const secondary = document.getElementById('actionSecondary');
    const renew = document.getElementById('actionRenew');
    if (renew) { renew.style.display = 'none'; renew.onclick = null; }
    const user = getCurrentUser();
    if (!primary) return;
    // clear potential existing handlers to avoid stale behavior
    primary.onclick = null;
    if (secondary) secondary.onclick = null;
    if (!user) {
        primary.textContent = 'Login to reserve/issue';
        primary.onclick = () => { window.location.href = 'login.html'; };
        return;
    }
    if (book.status === 'available') {
        primary.textContent = 'Issue Book';
        primary.onclick = async () => {
            const result = borrowBook(book.id, user.id);
            if (result.ok) { showToast('Book issued'); window.location.reload(); }
            else showToast(result.reason || 'Failed to issue');
        };
        // no secondary
        if (secondary) secondary.style.display = 'none';
    } else if (book.status === 'issued' && book.issuedTo === user.id) {
        // allow return
        // try to show due date info on primary
        const borrowings = getBorrowings();
        const borrow = borrowings.find(b => b.bookId === book.id && b.userId === user.id && !b.returnedAt);
        if (borrow && borrow.dueAt) {
            const due = new Date(borrow.dueAt);
            const now = new Date();
            const daysLeft = Math.ceil((due - now) / (24*60*60*1000));
            if (daysLeft >= 0) {
                primary.textContent = `Due: ${due.toLocaleDateString()} (${daysLeft} days)`;
            } else {
                primary.textContent = `Overdue: ${Math.abs(daysLeft)} days`;
            }
        } else {
            primary.textContent = 'My Borrowed';
        }
        if (secondary) { secondary.style.display = 'inline-block'; secondary.textContent = 'Return Book'; secondary.onclick = () => {
            const r = returnBook(book.id, user.id);
            if (r.ok) { showToast('Book returned' + (r.fine>0 ? ' - Fine: $'+r.fine : '')); window.location.reload(); }
            else showToast(r.reason || 'Return failed');
        }}
        // allow renew if no reservation queue
        const reservations = getReservations().filter(r => r.bookId === book.id && !r.fulfilledAt);
        if (reservations.length === 0 && renew) {
            renew.style.display = 'inline-block';
            renew.onclick = () => {
                const r = renewBook(book.id, user.id);
                if (r.ok) showToast('Renewed until ' + new Date(r.newDueAt).toLocaleDateString());
                else showToast(r.reason);
                window.location.reload();
            };
        } else if (renew) {
            renew.style.display = 'none';
            renew.onclick = null;
        }
    } else {
        primary.textContent = 'Reserve Book';
        primary.onclick = () => {
            const res = reserveBook(book.id, user.id);
            if (res.ok) { showToast('Reserved'); window.location.reload(); }
            else showToast(res.reason || 'Failed to reserve');
        };
        if (secondary) secondary.style.display = 'none';
    }
    // admin can force return
    if (user && user.role === 'admin' && book.status === 'issued') {
        if (secondary) {
            secondary.style.display = 'inline-block';
            secondary.textContent = 'Force Return';
            secondary.onclick = () => {
                const res = returnBook(book.id, book.issuedTo);
                if (res.ok) { showToast('Book force returned' + (res.fine?(' - Fine: $'+res.fine):'')); window.location.reload(); }
                else showToast(res.reason || 'Failed');
            };
        }
    }
}

function renderUserDashboard() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    const reservationsGrid = document.getElementById('myReservationsGrid');
    const borrowedGrid = document.getElementById('myBorrowedGrid');
    const availableGrid = document.getElementById('availableBooksGrid');
    if (reservationsGrid) {
        reservationsGrid.innerHTML = '';
        const reservations = getReservations().filter(r => r.userId === currentUser.id);
        reservations.forEach(r => {
            const book = findBook(r.bookId);
            if (!book) return;
            const card = document.createElement('div'); card.className = 'book-card';
            card.innerHTML = `\n                <img src="${book.cover}">\n                <h3 class="book-title">${book.title}</h3>\n                <p class="book-author">Reserved</p>`;
            reservationsGrid.appendChild(card);
        });
    }
    if (borrowedGrid) {
        borrowedGrid.innerHTML = '';
        const borrowings = getBorrowings().filter(b => b.userId === currentUser.id && !b.returnedAt);
        if (borrowings.length === 0) {
            const p = document.createElement('p'); p.style.opacity = '0.8'; p.style.textAlign = 'center'; p.style.width = '100%'; p.style.marginTop = '14px'; p.textContent = 'No borrowed books found';
            borrowedGrid.appendChild(p);
        }
        borrowings.forEach(b => {
            const book = findBook(b.bookId);
            if (!book) return;
            const card = document.createElement('div'); card.className = 'book-card';
            const due = b.dueAt ? new Date(b.dueAt).toLocaleDateString() : '';
            card.innerHTML = `
                <img src="${book.cover}">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">Due: ${due}</p>
            `;
            const actions = document.createElement('div'); actions.style.display = 'flex'; actions.style.gap = '8px'; actions.style.marginTop = '8px';
            const viewBtn = document.createElement('a'); viewBtn.className='btn-gold'; viewBtn.textContent='Details'; viewBtn.href = `book_details.html?id=${book.id}`;
            actions.appendChild(viewBtn);
            const returnBtn = document.createElement('button'); returnBtn.className='btn-gold'; returnBtn.style.background = '#6a5845'; returnBtn.textContent='Return';
            returnBtn.onclick = () => { const r = returnBook(book.id, currentUser.id); if (r.ok) { showToast('Returned' + (r.fine?(' - Fine: $'+r.fine):'')); renderUserDashboard(); renderBooksGrid(); } else showToast(r.reason || 'Return failed'); };
            actions.appendChild(returnBtn);
            // renew button only when no reservations
            const queue = getReservations().filter(rr => rr.bookId === book.id && !rr.fulfilledAt);
            if (queue.length === 0) {
                const renewBtn = document.createElement('button'); renewBtn.className='btn-gold'; renewBtn.style.background='#8ea67f'; renewBtn.textContent='Renew';
                renewBtn.onclick = () => { const res = renewBook(book.id, currentUser.id); if (res.ok) { showToast('Extended until '+new Date(res.newDueAt).toLocaleDateString()); renderUserDashboard(); } else showToast(res.reason || 'Cannot renew'); };
                actions.appendChild(renewBtn);
            }
            card.appendChild(actions);
            borrowedGrid.appendChild(card);
        });
    }
    if (availableGrid) {
        availableGrid.innerHTML = '';
        const books = getBooks().filter(b => b.status === 'available');
        books.forEach(book => {
            const card = document.createElement('div'); card.className = 'book-card';
            card.innerHTML = `\n                <img src="${book.cover}">\n                <h3 class="book-title">${book.title}</h3>\n                <p class="book-author">${book.author}</p>\n                <a href="book_details.html?id=${book.id}" class="btn-gold" style="display:block; text-align:center; margin-top:10px;">View</a>`;
            availableGrid.appendChild(card);
        });
    }
}

// =================================================
// AUTHENTICATION & SESSION MANAGEMENT (existing)
// =================================================

// Demo Users Database (In production, this would be on a server)
const DEMO_USERS = [
    { id: 1, email: 'user@example.com', password: 'user123', role: 'user', name: 'John User' },
    { id: 2, email: 'admin@example.com', password: 'admin123', role: 'admin', name: 'Admin User' }
];

// Initialize session from localStorage
function initializeSession() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        updateNavbarForLoggedInUser(user);
    }
}

// Ensure the default demo regular user exists (without overwriting other users)
function ensureDefaultRegularUser() {
    const defaultEmail = 'user@example.com';
    const existing = findUserByEmail(defaultEmail);
    if (!existing) {
        addUser({ email: defaultEmail, password: 'user123', role: 'user', name: 'John User', type: 'member' });
        console.log('Default regular user created:', defaultEmail);
        showToast('Default user restored: ' + defaultEmail, 3000);
    }
}

// Update navbar based on login status
function updateNavbarForLoggedInUser(user) {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && user) {
        const navHTML = `
            <a href="index.html">Home</a>
            <a href="books.html">Books</a>
            <a href="${user.role === 'admin' ? 'admin_dashboard.html' : 'user_dashboard.html'}">Dashboard</a>
            <a href="profile.html">Profile</a>
            <a href="#" onclick="logout(event)">Logout</a>
        `;
        navLinks.innerHTML = navHTML;
    }
}

// Login Handler
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const errorDiv = document.getElementById('loginError');

    // Clear previous errors
    if (errorDiv) errorDiv.style.display = 'none';

    // Find user in users DB (email case-insensitive)
    const users = getUsers();
    const normalizedEmail = (email || '').trim().toLowerCase();
    const userByEmail = users.find(u => (u.email || '').toLowerCase() === normalizedEmail);
    let user = null;
    if (userByEmail) {
        // check password and role
        if (userByEmail.password === password && userByEmail.role === role) {
            user = userByEmail;
        } else {
            // specific error for debugging/helpful message
            let reason = 'Invalid email, password, or role. Please try again.';
            if (userByEmail.password !== password) reason = 'Incorrect password.';
            else if (userByEmail.role !== role) reason = `Selected role '${role}' does not match account role.`;
            if (errorDiv) { errorDiv.textContent = reason; errorDiv.style.display = 'block'; }
            return;
        }
    }

    if (user) {
        // Store user session
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            loginTime: new Date().toISOString()
        }));

        // Redirect based on role
        if (user.role === 'admin') {
            window.location.href = 'admin_dashboard.html';
        } else {
            window.location.href = 'user_dashboard.html';
        }
    } else {
        // Show error message
        if (errorDiv) {
            errorDiv.textContent = 'Invalid email, password, or role. Please try again.';
            errorDiv.style.display = 'block';
        }
    }
}

// Logout Handler
function logout(event) {
    event.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('currentUser') !== null;
}

// Get current user
function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

// Protect pages (redirect to login if not authenticated)
function protectPage(requiredRole = null) {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }

    if (requiredRole && user.role !== requiredRole) {
        window.location.href = user.role === 'admin' ? 'admin_dashboard.html' : 'user_dashboard.html';
        return false;
    }

    return true;
}

// Attach login form handler when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DB and session
    initializeDB();
    initializeSession();
    // Ensure default regular user exists for login convenience
    ensureDefaultRegularUser();

    // Attach login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    // Signup modal handlers
    const signupLink = document.querySelector('.signup-link');
    const signupModal = document.getElementById('signupModal');
    const cancelSignup = document.getElementById('cancelSignup');
    const signupForm = document.getElementById('signupForm');
    if (signupLink) signupLink.addEventListener('click', (e)=>{ e.preventDefault(); if (signupModal) signupModal.style.display = 'flex'; });
    if (cancelSignup) cancelSignup.addEventListener('click', (e)=>{ e.preventDefault(); if (signupModal) signupModal.style.display = 'none'; });
    if (signupForm) signupForm.addEventListener('submit', function(e){
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const type = document.getElementById('signupType').value;
        if (findUserByEmail(email)) { showToast('Email already registered'); return; }
        const role = 'user';
        const newUser = addUser({ name, email, password, role, type });
        // auto-login
        localStorage.setItem('currentUser', JSON.stringify({ id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name, loginTime: new Date().toISOString() }));
        if (signupModal) signupModal.style.display = 'none';
        showToast('Account created & logged in');
        updateNavbarForLoggedInUser(newUser);
        window.location.href = 'user_dashboard.html';
    });

    // Attach add book handler
    const addBookForm = document.getElementById('addBookForm');
    if (addBookForm) {
        addBookForm.addEventListener('submit', function(e){
            e.preventDefault();
            const title = document.getElementById('title').value;
            const author = document.getElementById('author').value;
            const category = document.getElementById('category').value;
            const imageInput = document.getElementById('imageInput');
            const editId = document.getElementById('bookId').value;

            const book = { title, author, category, isbn: Date.now().toString(), publisher: '', year: new Date().getFullYear(), language: 'English', status: 'available' };

            if (imageInput && imageInput.files && imageInput.files.length) {
                const file = imageInput.files[0];
                const reader = new FileReader();
                reader.onload = function(ev) {
                    book.cover = ev.target.result; // dataurl
                    if (editId && editId.length) {
                        book.id = parseInt(editId);
                        updateBook(book);
                        showToast('Book updated');
                    } else {
                        addBook(book);
                        showToast('Book added');
                    }
                    addBookForm.reset();
                    renderBooksGrid();
                }
                reader.readAsDataURL(file);
            } else {
                // no file - use placeholder
                book.cover = 'images/book1.jpg';
                if (editId && editId.length) {
                    book.id = parseInt(editId);
                    const existing = findBook(book.id);
                    if (existing) book.cover = existing.cover;
                    updateBook(book);
                    showToast('Book updated');
                } else {
                    addBook(book);
                    showToast('Book added');
                }
                addBookForm.reset();
                renderBooksGrid();
            }
        });
    }

    // seed demo data button
    const seedBtn = document.getElementById('seedDemoBtn');
    if (seedBtn) seedBtn.addEventListener('click', seedDemoData);

    const resetBtn = document.getElementById('resetDemoBtn');
    if (resetBtn) resetBtn.addEventListener('click', resetToDefaults);

    const fakeResBtn = document.getElementById('fakeReservationsBtn');
    if (fakeResBtn) fakeResBtn.addEventListener('click', () => createFakeReservations(2));

    // If edit mode: populate add book form
    const editParam = new URLSearchParams(window.location.search).get('edit');
    if (editParam) {
        const bookToEdit = findBook(editParam);
        if (bookToEdit) {
            document.getElementById('bookId').value = bookToEdit.id;
            document.getElementById('title').value = bookToEdit.title;
            document.getElementById('author').value = bookToEdit.author;
            document.getElementById('category').value = bookToEdit.category;
        }
    }

    // Update welcome message on dashboards
    const user = getCurrentUser();
    if (user) {
        const welcomeElements = document.querySelectorAll('.admin-title, [data-welcome]');
        welcomeElements.forEach(el => {
            if (el.textContent.includes('Welcome')) {
                el.textContent = el.textContent.replace('Admin', user.name).replace('User', user.name);
            }
        });
    }

    // Profile page populate
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileAvatar = document.getElementById('profileAvatar');
    const editProfileToggle = document.getElementById('editProfileToggle');
    const editProfileForm = document.getElementById('editProfileForm');
    const cancelEditProfile = document.getElementById('cancelEditProfile');
    const editFullName = document.getElementById('editFullName');
    const editEmail = document.getElementById('editEmail');
    const editPassword = document.getElementById('editPassword');
    if (profileName && profileEmail && profileAvatar && user) {
        profileName.textContent = user.name;
        profileEmail.textContent = user.email;
        editFullName.value = user.name;
        editEmail.value = user.email;
    }
    if (editProfileToggle) {
        editProfileToggle.addEventListener('click', () => { if (editProfileForm) editProfileForm.style.display = 'block'; });
    }
    if (cancelEditProfile) cancelEditProfile.addEventListener('click', (e)=>{ e.preventDefault(); if (editProfileForm) editProfileForm.style.display = 'none'; });
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', (e)=>{
            e.preventDefault();
            const currentUser = getCurrentUser();
            if (!currentUser) return window.location.href = 'login.html';
            const userObj = getUsers().find(u => u.id === currentUser.id);
            if (!userObj) return;
            userObj.name = editFullName.value;
            userObj.email = editEmail.value;
            if (editPassword.value && editPassword.value.trim().length) {
                userObj.password = editPassword.value;
            }
            updateUser(userObj);
            // update current session
            localStorage.setItem('currentUser', JSON.stringify({ id: userObj.id, email: userObj.email, role: userObj.role, name: userObj.name, loginTime: new Date().toISOString() }));
            profileName.textContent = userObj.name; profileEmail.textContent = userObj.email; showToast('Profile updated');
            editProfileForm.style.display = 'none';
            updateNavbarForLoggedInUser(userObj);
        });
    }

    // Populate Reading History in profile
    const profileHistory = document.getElementById('profileHistory');
    if (profileHistory && user) {
        const borrowings = getBorrowings().filter(b => b.userId === user.id);
        profileHistory.innerHTML = '';
        borrowings.forEach(b => {
            const book = findBook(b.bookId);
            if (!book) return;
            const card = document.createElement('div'); card.className = 'book-card';
            card.innerHTML = `\n                <img src="${book.cover}">\n                <h3 class="book-title">${book.title}</h3>\n                <p class="book-author">Borrowed: ${new Date(b.borrowedAt).toLocaleDateString()}</p>\n                <p style="font-size:13px; opacity:0.8;">Due: ${new Date(b.dueAt).toLocaleDateString()}</p>\n            `;
            profileHistory.appendChild(card);
        });
    }

    // Render books list on index/books pages
    renderBooksGrid();

    // Attach search input if present
    const searchInput = document.getElementById('searchBooks');
    if (searchInput) {
        searchInput.addEventListener('input', function() { renderBooksGrid(this.value); });
    }

    // Setup book details page if present
    const detailsImage = document.getElementById('detailsImage');
    if (detailsImage) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const book = findBook(id);
        if (!id || !book) {
            const container = detailsImage.closest('.details-container');
            if (container) {
                container.innerHTML = '<div style="padding:40px; text-align:center; font-size:18px; color:#d0a873;">Book not found. <a href="books.html" style="color:#e6c08b;">Back to books</a></div>';
            }
        } else {
            detailsImage.src = book.cover;
            const detailsTitle = document.getElementById('detailsTitle');
            const detailsAuthor = document.getElementById('detailsAuthor');
            const detailsISBN = document.getElementById('detailsISBN');
            const detailsCategory = document.getElementById('detailsCategory');
            const detailsYear = document.getElementById('detailsYear');
            const detailsLanguage = document.getElementById('detailsLanguage');
            const detailsPublisher = document.getElementById('detailsPublisher');
            const detailsStatus = document.getElementById('detailsStatus');
            const detailsDescription = document.getElementById('detailsDescription');
            const borrowerInfo = document.getElementById('borrowerInfo');
            const reservationsList = document.getElementById('reservationsList');
            const similarGrid = document.getElementById('similarBooksGrid');
            if (detailsTitle) detailsTitle.textContent = book.title;
            if (detailsAuthor) detailsAuthor.textContent = book.author;
            if (detailsStatus) detailsStatus.textContent = `Status: ${book.status}`;
            if (detailsISBN) detailsISBN.textContent = `ISBN: ${book.isbn || '-'}`;
            if (detailsCategory) detailsCategory.textContent = `Category: ${book.category || '-'}`;
            if (detailsYear) detailsYear.textContent = `Published: ${book.year || '-'}`;
            if (detailsLanguage) detailsLanguage.textContent = `Lang: ${book.language || '-'}`;
            if (detailsPublisher) detailsPublisher.textContent = `Publisher: ${book.publisher || '-'}`;
            if (detailsDescription) detailsDescription.textContent = book.description || detailsDescription.textContent;
            // render action buttons
            const detailsBtn = document.querySelector('.details-btn');
            if (detailsBtn) {
                detailsBtn.textContent = book.status === 'available' ? 'Reserve/Issue' : 'Reserve';
            }
            // bind actions
            setupBookDetailsActions();

            // show borrower if issued
            if (borrowerInfo) {
                borrowerInfo.innerHTML = '';
                if (book.status === 'issued') {
                    const user = getUsers().find(u => u.id === book.issuedTo);
                    if (user) {
                        const currentLoan = getBorrowings().find(b => b.bookId === book.id && !b.returnedAt);
                        if (currentLoan) {
                            borrowerInfo.innerHTML = `<strong>Borrowed by:</strong> ${user.name || user.email} — <strong>Due:</strong> ${new Date(currentLoan.dueAt).toLocaleDateString()}`;
                        }
                    }
                }
            }

            // show reservation queue
            if (reservationsList) {
                const queue = getReservations().filter(r => r.bookId === book.id && !r.fulfilledAt);
                if (queue.length > 0) {
                    reservationsList.innerHTML = `<strong>Reservation queue:</strong> ${queue.map(q => { const u = getUsers().find(x => x.id === q.userId); return u ? u.email : q.userId; }).join(', ')}`;
                } else {
                    reservationsList.innerHTML = '';
                }
            }

            // render similar books
            if (similarGrid) {
                similarGrid.innerHTML = '';
                const sims = getBooks().filter(b => b.category === book.category && b.id !== book.id).slice(0,4);
                sims.forEach(s => {
                    const c = document.createElement('div'); c.className = 'book-card';
                    c.innerHTML = `<img src="${s.cover}"><h3 class="book-title">${s.title}</h3><p class="book-author">${s.author}</p><a href="book_details.html?id=${s.id}" class="btn-gold" style="display:block;text-align:center;margin-top:10px;">Details</a>`;
                    similarGrid.appendChild(c);
                });
            }
        }
    }

    // Admin dashboard report render
    const adminReportTarget = document.getElementById('adminReport');
    if (adminReportTarget) {
        const report = generateReport();
        adminReportTarget.innerHTML = `
            <div class="admin-card"><h3>Total Books</h3><p class="card-number">${report.totalBooks}</p></div>
            <div class="admin-card"><h3>Borrowed</h3><p class="card-number">${report.borrowedCount}</p></div>
            <div class="admin-card"><h3>Overdue</h3><p class="card-number">${report.overdueCount}</p></div>
            <div class="admin-card"><h3>Reserved</h3><p class="card-number">${report.reservedCount}</p></div>
            <div class="admin-card"><h3>Fines Collected</h3><p class="card-number">$${report.finesCollected.toFixed(2)}</p></div>
            <div class="admin-card"><h3>Fines Outstanding</h3><p class="card-number">$${report.finesOutstanding.toFixed(2)}</p></div>
        `;
    }
    // populate reservations table
    const adminReservationsBody = document.getElementById('adminReservationsTableBody');
    if (adminReservationsBody) {
        const reservations = getReservations().slice().reverse().slice(0,10); // recent 10
        adminReservationsBody.innerHTML = '';
        if (reservations.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="4" style="text-align:center;opacity:0.8;">No reservations found</td>`;
            adminReservationsBody.appendChild(tr);
        }
        reservations.forEach(r => {
            const user = getUsers().find(u => u.id === r.userId);
            const book = findBook(r.bookId);
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${user ? user.email : r.userId}</td><td>${book ? book.title : r.bookId}</td><td>${new Date(r.reservedAt).toLocaleDateString()}</td><td>${r.fulfilledAt ? 'Fulfilled' : 'Pending'}</td>`;
            adminReservationsBody.appendChild(tr);
        });
    }

    const reservationsTableBody = document.getElementById('reservationsTableBody');
    if (reservationsTableBody) {
        const reservations = getReservations();
        reservationsTableBody.innerHTML = '';
        if (reservations.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="4" style="text-align:center;opacity:0.8;">No reservations found</td>`;
            reservationsTableBody.appendChild(tr);
        }
        reservations.forEach(r => {
            const user = getUsers().find(u => u.id === r.userId);
            const book = findBook(r.bookId);
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${user ? user.email : r.userId}</td><td>${book ? book.title : r.bookId}</td><td>${new Date(r.reservedAt).toLocaleDateString()}</td><td>${r.fulfilledAt ? 'Fulfilled' : 'Pending'}</td>`;
            reservationsTableBody.appendChild(tr);
        });
    }
    
    // Page access protection
    if (window.location.pathname.includes('admin_dashboard.html')) protectPage('admin');
    if (window.location.pathname.includes('user_dashboard.html')) protectPage();

    // Render user dashboard if present
    if (window.location.pathname.includes('user_dashboard.html')) renderUserDashboard();

    // Display notifications if any
    displayNotifications();

    // check reminders and overdue
    const currentUserReminders = getCurrentUser();
    if (currentUserReminders) {
        const borrows = getBorrowings().filter(b => b.userId === currentUserReminders.id && !b.returnedAt);
        const now = new Date();
        borrows.forEach(b => {
            const due = new Date(b.dueAt);
            if (due < now) {
                pushNotification({ toUserId: currentUserReminders.id, message: `Your book (id:${b.bookId}) is overdue. Please return it.` });
            } else {
                const diffDays = Math.ceil((due - now) / (24 * 60 * 60 * 1000));
                if (diffDays <= 2) pushNotification({ toUserId: currentUserReminders.id, message: `Your book (id:${b.bookId}) is due in ${diffDays} day(s).` });
            }
        });
        displayNotifications();
    }

fetch("api/books.php")
  .then(res => res.json())
  .then(books => {
    const c = document.getElementById("booksContainer");
    if (!c) return;

    c.innerHTML = "";

    books.forEach(b => {
      c.innerHTML += `
        <div class="book-card">
          <h3>${b.title}</h3>
          <p>${b.author}</p>
          <p>${b.publication_year ?? ""}</p>
        </div>
      `;
    });
  })
  .catch(err => console.error(err));



});

console.log('University Library Pro - Authentication loaded');