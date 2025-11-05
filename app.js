// app.js
// App state
let allConfig = {};
let currentUser = null;
let activeCategoryFilter = 'Semua'; // State untuk filter aktif

// DOM elements
const loginScreen = document.getElementById('loginScreen');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passphraseInput = document.getElementById('passphrase');
const loginError = document.getElementById('loginError');
const loginButton = document.getElementById('loginButton'); // Tambahkan
const loadingOverlay = document.getElementById('loadingOverlay'); // Tambahkan
const userInfo = document.getElementById('userInfo');
const lockBtn = document.getElementById('lockBtn');
const searchInput = document.getElementById('searchInput'); // Tambahkan
const categoryFilters = document.getElementById('categoryFilters'); // Tambahkan
const linksContainer = document.getElementById('linksContainer');
const noLinksMessage = document.getElementById('noLinksMessage');
const linkModal = document.getElementById('linkModal');
const modalTitle = document.getElementById('modalTitle');
const modalImageContainer = document.getElementById('modalImageContainer');
const modalUrl = document.getElementById('modalUrl');
const modalNotes = document.getElementById('modalNotes');
const modalVisitLink = document.getElementById('modalVisitLink');
const closeModal = document.getElementById('closeModal');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadConfigAndSetup();
});

function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    lockBtn.addEventListener('click', handleLogout);
    searchInput.addEventListener('input', applyFiltersAndSearch); // Tambahkan
    closeModal.addEventListener('click', () => linkModal.classList.add('hidden'));
    linkModal.addEventListener('click', (e) => {
        if (e.target === linkModal) {
            linkModal.classList.add('hidden');
        }
    });
}

async function loadConfigAndSetup() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) throw new Error('Gagal memuat konfigurasi.');
        allConfig = await response.json();
    } catch (error) {
        console.error('Error loading configuration:', error);
        showToast('Gagal memuat data. Pastikan config.json ada dan valid.', 'error');
        loginForm.style.display = 'none';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const passphrase = passphraseInput.value;

    if (!username || !passphrase) {
        showLoginError('Username dan passphrase harus diisi.');
        return;
    }

    // Tampilkan loading overlay
    loadingOverlay.classList.remove('hidden');
    loginButton.disabled = true;
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Memuat...';

    // Gunakan setTimeout untuk memastikan UI diperbarui sebelum proses berat dimulai
    setTimeout(() => {
        const account = allConfig.accounts.find(acc => {
            const hashedUsername = CryptoJS.PBKDF2(username, CryptoJS.enc.Hex.parse(acc.salt), {
                keySize: 256/32, iterations: 2000, hasher: CryptoJS.algo.SHA256
            }).toString();
            
            const hashedPassphrase = CryptoJS.PBKDF2(passphrase, CryptoJS.enc.Hex.parse(acc.salt), {
                keySize: 256/32, iterations: 2000, hasher: CryptoJS.algo.SHA256
            }).toString();

            return hashedUsername === acc.username_hash && hashedPassphrase === acc.passphrase_hash;
        });

        // Sembunyikan loading overlay setelah proses selesai
        loadingOverlay.classList.add('hidden');
        loginButton.disabled = false;
        loginButton.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>Masuk';

        if (account) {
            currentUser = account;
            loginScreen.classList.add('hidden');
            mainApp.classList.remove('hidden');
            mainApp.classList.add('animate-fade-in');
            userInfo.textContent = `${currentUser.account_name} (${currentUser.role})`;
            renderCategoryFilters(); // Render filter kategori
            applyFiltersAndSearch(); // Render link awal
        } else {
            showLoginError('Username atau passphrase salah.');
        }
    }, 100); // Delay singkat untuk memastikan UI update
}

function showLoginError(message) {
    loginError.querySelector('span').textContent = message;
    loginError.classList.remove('hidden');
    setTimeout(() => loginError.classList.add('hidden'), 5000);
}

function handleLogout() {
    currentUser = null;
    activeCategoryFilter = 'Semua'; // Reset filter
    mainApp.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    usernameInput.value = '';
    passphraseInput.value = '';
    loginError.classList.add('hidden');
}

// --- FUNGSI BARU UNTUK KATEGORI, PENCARIAN, DAN FILTER ---

function generateCategoryColor(category) {
    // Buat warna yang konsisten untuk setiap kategori berdasarkan hash string-nya
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
        hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
}

function getUniqueCategories() {
    const categories = new Set(allConfig.links.map(link => link.category));
    return Array.from(categories).sort();
}

function renderCategoryFilters() {
    categoryFilters.innerHTML = '';
    const categories = ['Semua', ...getUniqueCategories()];

    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.className = `px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${category === activeCategoryFilter ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`;
        
        if (category === 'Semua') {
            button.classList.add('bg-gray-500', 'text-white');
        } else {
            const color = generateCategoryColor(category);
            button.style.backgroundColor = color;
            button.classList.add('text-white');
        }
        
        button.addEventListener('click', () => {
            activeCategoryFilter = category;
            renderCategoryFilters(); // Render ulang untuk update tampilan filter aktif
            applyFiltersAndSearch();
        });
        
        categoryFilters.appendChild(button);
    });
}

function applyFiltersAndSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    let viewableLinks = [];
    if (currentUser.role === 'administrator') {
        viewableLinks = allConfig.links;
    } else if (currentUser.role === 'dinkes') {
        const puskesmasIds = allConfig.accounts.filter(acc => acc.role === 'puskesmas').map(acc => acc.id);
        const allowedIds = [currentUser.id, ...puskesmasIds];
        viewableLinks = allConfig.links.filter(link => link.assigned_ids.some(id => allowedIds.includes(id)));
    } else if (currentUser.role === 'puskesmas') {
        viewableLinks = allConfig.links.filter(link => link.assigned_ids.includes(currentUser.id));
    }

    // Filter berdasarkan kategori
    if (activeCategoryFilter !== 'Semua') {
        viewableLinks = viewableLinks.filter(link => link.category === activeCategoryFilter);
    }

    // Filter berdasarkan pencarian
    if (searchTerm) {
        viewableLinks = viewableLinks.filter(link =>
            link.title.toLowerCase().includes(searchTerm) ||
            link.url.toLowerCase().includes(searchTerm) ||
            (link.notes && link.notes.toLowerCase().includes(searchTerm)) ||
            link.category.toLowerCase().includes(searchTerm)
        );
    }

    renderLinks(viewableLinks);
}

function renderLinks(linksToRender) {
    linksContainer.innerHTML = '';
    
    if (linksToRender.length === 0) {
        noLinksMessage.classList.remove('hidden');
        return;
    }
    
    noLinksMessage.classList.add('hidden');
    linksToRender.forEach(link => {
        const card = createLinkCard(link);
        linksContainer.appendChild(card);
    });
}

function createLinkCard(link) {
    const card = document.createElement('div');
    card.className = 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20 dark:border-gray-700/50 overflow-hidden cursor-pointer animate-slide-up';
    
    const imageHtml = link.image_url 
        ? `<img src="${link.image_url}" alt="${link.title}" class="w-full h-32 object-cover">`
        : `<div class="w-full h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center"><i class="fas fa-link text-4xl text-gray-400"></i></div>`;

    const categoryColor = generateCategoryColor(link.category);
    const categoryBadge = `<span class="inline-block px-2 py-1 text-xs font-semibold text-white rounded-full" style="background-color: ${categoryColor}">${link.category}</span>`;

    card.innerHTML = `
        ${imageHtml}
        <div class="p-4">
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-lg flex-grow mr-2 truncate">${link.title}</h3>
                ${categoryBadge}
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 truncate">${link.url}</p>
        </div>
    `;

    card.addEventListener('click', () => showLinkDetail(link));
    return card;
}

function showLinkDetail(link) {
    modalTitle.textContent = link.title;
    modalUrl.innerHTML = `<strong>URL:</strong> <a href="${link.url}" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline">${link.url}</a>`;
    modalNotes.textContent = link.notes || 'Tidak ada catatan.';
    modalVisitLink.href = link.url;

    if (link.image_url) {
        modalImageContainer.innerHTML = `<img src="${link.image_url}" alt="${link.title}" class="w-full h-full object-cover">`;
    } else {
        modalImageContainer.innerHTML = '<i class="fas fa-link text-6xl text-gray-400"></i>';
    }
    
    linkModal.classList.remove('hidden');
}

// Show toast notification
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    
    if (type === 'error') {
        toast.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg transform transition-transform duration-300 z-50';
    } else {
        toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg transform transition-transform duration-300 z-50';
    }
    
    toast.classList.remove('translate-y-full');
    
    setTimeout(() => {
        toast.classList.add('translate-y-full');
    }, 3000);
}