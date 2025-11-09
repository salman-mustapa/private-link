// app.js (diperbarui dan sudah diperbaiki)
// --- KONFIGURASI ---
const SHEET_ID = '1EZt7Lur8a9fVFNen0lzfOrO01acZMb0_p0tKA-ZQzEo'; 
// const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbz5uMHZUhD9BGQSQPHtwvd3e6BKnt0MUkyFuWFc1-cano3IVHX6gGznML6TEMj0k4PF/exechttps://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjXQozrrVPf9ZI_4em7s_51zT2siPMD42kx6O1WG3ZTWhbOx5Ulm8SIMKf-9mUFbSfGRHayiR7qFUu5vOXbqDRvAzHC2r-yPlGFByBgCCKa4WT7AUQWZrg4Wv5jGZGBcs7W2B77A42wMG8ef-KgQ0fqV8HOWWRP6BIA4CkS7VdqtaDfrgANow_kOz6IqRujey_bfs5vFXYojPyPo1RyujJvuJT5nRqQ7GpEnrfdjXvhSS7QpCVB70hUMFEw4nt0HVR_orTOQftOdBriqaGtPE2CC8fMGA&lib=MZ-txHtiPDmEoj6CVhmd_dCRaTC3zs4Zj";
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycby3nfDYlzunI1jl--0wl_35KipyWc-cI9HcVgWNMj9--PBL1btQbJcQzBR5CDOdMgfR/exec";

// --- STATE ---
let allAccounts = [];
let allLinks = [];
let currentUser = null;
let isAuthenticatedToAdd = false;
let currentPage = 1;
const itemsPerPage = 10;
let activeCategoryFilter = 'Semua';
let deleteType = '';
let deleteId = '';
let allCategories = [];
let dataRefreshInterval = null;
let currentLinkDetail = null;

// --- DOM REFERENCES (akan diisi di DOMContentLoaded) ---
let loginScreen, mainApp, loginForm, usernameInput, passphraseInput, loginError, contactLoginBtn;
let userInfo, lockBtn, addLinkBtn, mobileAddLink, mobileLock;
let adminLinksView, adminAccountsView, adminHomeView, userGridView, adminNav, showLinksViewBtn, showAccountsViewBtn, showHomeViewBtn;
let linksTableBody, accountsTableBody, linksContainer, noLinksMessage, categoryFilters, searchInput;
let addLinkModal, addAccountModal, reauthModal, addLinkForm, addAccountForm, reauthForm, reauthError, multiSelectContainer;
let bottomNav, toast, toastMessage, errorToast, errorToastMessage, contactModal;
let editLinkModal, editLinkForm, editMultiSelectContainer;
let editAccountModal, editAccountForm;
let deleteModal, confirmDelete, cancelDelete;
let userActions;
let searchInputAdmin, categoryFilterAdmin, searchInputAccounts, roleFilterAccounts;
let addLinkBtnAdmin,addAccountBtnAdmin;
let totalLinks, totalAccounts, adminAccounts, lastUpdate;
let categoryDropdownBtn, categoryDropdown, categoryToggle, categorySuggestions;
let editCategoryToggle, editCategorySuggestions;
let loader;
let profileBtn, mobileProfile, profileModal, profileForm;
let linkDetailModal, detailTitle, detailUrl, detailImage, detailImageContainer, detailCategory, detailNotes, detailAssigned, detailCreatedBy, detailCreatedAt, detailLastUpdate, detailEditBtn, detailDeleteBtn;

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    // assign DOM refs
    loginScreen = document.getElementById('loginScreen');
    mainApp = document.getElementById('mainApp');
    loginForm = document.getElementById('loginForm');
    usernameInput = document.getElementById('username');
    passphraseInput = document.getElementById('passphrase');
    loginError = document.getElementById('loginError');
    contactLoginBtn = document.getElementById('contactLoginBtn');
    userInfo = document.getElementById('userInfo');
    lockBtn = document.getElementById('lockBtn');
    addLinkBtn = document.getElementById('addLinkBtn');
    mobileAddLink = document.getElementById('mobileAddLink');
    mobileLock = document.getElementById('mobileLock');
    adminLinksView = document.getElementById('adminLinksView');
    adminAccountsView = document.getElementById('adminAccountsView');
    adminHomeView = document.getElementById('adminHomeView');
    userGridView = document.getElementById('userGridView');
    adminNav = document.getElementById('adminNav');
    showLinksViewBtn = document.getElementById('showLinksView');
    showAccountsViewBtn = document.getElementById('showAccountsView');
    showHomeViewBtn = document.getElementById('showHomeView');
    linksTableBody = document.getElementById('linksTableBody');
    accountsTableBody = document.getElementById('accountsTableBody');
    linksContainer = document.getElementById('linksContainer');
    noLinksMessage = document.getElementById('noLinksMessage');
    categoryFilters = document.getElementById('categoryFilters');
    searchInput = document.getElementById('searchInput');
    addLinkModal = document.getElementById('addLinkModal');
    addAccountModal = document.getElementById('addAccountModal');
    reauthModal = document.getElementById('reauthModal');
    addLinkForm = document.getElementById('addLinkForm');
    addAccountForm = document.getElementById('addAccountForm');
    reauthForm = document.getElementById('reauthForm');
    reauthError = document.getElementById('reauthError');
    multiSelectContainer = document.getElementById('multiSelectContainer');
    bottomNav = document.getElementById('bottomNav');
    toast = document.getElementById('toast');
    toastMessage = document.getElementById('toastMessage');
    errorToast = document.getElementById('errorToast');
    errorToastMessage = document.getElementById('errorToastMessage');
    contactModal = document.getElementById('contactModal');
    editLinkModal = document.getElementById('editLinkModal');
    editLinkForm = document.getElementById('editLinkForm');
    editAccountModal = document.getElementById('editAccountModal');
    editAccountForm = document.getElementById('editAccountForm');
    editMultiSelectContainer = document.getElementById('editMultiSelectContainer');
    deleteModal = document.getElementById('deleteModal');
    confirmDelete = document.getElementById('confirmDelete');
    cancelDelete = document.getElementById('cancelDelete');
    userActions = document.getElementById('userActions');
    searchInputAdmin = document.getElementById('searchInputAdmin');
    categoryFilterAdmin = document.getElementById('categoryFilterAdmin');
    searchInputAccounts = document.getElementById('searchInputAccounts');
    roleFilterAccounts = document.getElementById('roleFilterAccounts');
    addLinkBtnAdmin = document.getElementById('addLinkBtnAdmin');
    addAccountBtnAdmin = document.getElementById('addAccountBtnAdmin');
    totalLinks = document.getElementById('totalLinks');
    totalAccounts = document.getElementById('totalAccounts');
    adminAccounts = document.getElementById('adminAccounts');
    lastUpdate = document.getElementById('lastUpdate');
    categoryDropdownBtn = document.getElementById('categoryDropdownBtn');
    categoryDropdown = document.getElementById('categoryDropdown');
    categoryToggle = document.getElementById('categoryToggle');
    categorySuggestions = document.getElementById('categorySuggestions');
    editCategoryToggle = document.getElementById('editCategoryToggle');
    editCategorySuggestions = document.getElementById('editCategorySuggestions');
    loader = document.getElementById('loader');
    profileBtn = document.getElementById('profileBtn');
    mobileProfile = document.getElementById('mobileProfile');
    profileModal = document.getElementById('profileModal');
    profileForm = document.getElementById('profileForm');
    linkDetailModal = document.getElementById('linkDetailModal');
    detailTitle = document.getElementById('detailTitle');
    detailUrl = document.getElementById('detailUrl');
    detailImage = document.getElementById('detailImage');
    detailImageContainer = document.getElementById('detailImageContainer');
    detailCategory = document.getElementById('detailCategory');
    detailNotes = document.getElementById('detailNotes');
    detailAssigned = document.getElementById('detailAssigned');
    detailCreatedBy = document.getElementById('detailCreatedBy');
    detailCreatedAt = document.getElementById('detailCreatedAt');
    detailLastUpdate = document.getElementById('detailLastUpdate');
    detailEditBtn = document.getElementById('detailEditBtn');
    detailDeleteBtn = document.getElementById('detailDeleteBtn');

    setupEventListeners();
    setupTheme();
});

// --- SETUP ---
function setupEventListeners() {
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (lockBtn) lockBtn.addEventListener('click', handleLogout);
    if (mobileLock) mobileLock.addEventListener('click', handleLogout);
    if (addLinkBtn) addLinkBtn.addEventListener('click', () => showModal('addLinkModal'));
    if (mobileAddLink) mobileAddLink.addEventListener('click', () => showModal('addLinkModal'));
    if (addLinkBtnAdmin) addLinkBtnAdmin.addEventListener('click', () => showModal('addLinkModal'));
    if (addAccountBtnAdmin) addAccountBtnAdmin.addEventListener('click', () => showModal('addAccountModal'));
    if (showLinksViewBtn) showLinksViewBtn.addEventListener('click', () => showAdminView('links'));
    if (showAccountsViewBtn) showAccountsViewBtn.addEventListener('click', () => showAdminView('accounts'));
    if (showHomeViewBtn) showHomeViewBtn.addEventListener('click', () => showAdminView('home'));

    if (addLinkForm) addLinkForm.addEventListener('submit', handleAddLink);
    if (addAccountForm) addAccountForm.addEventListener('submit', handleAddAccount);
    if (editAccountForm) editAccountForm.addEventListener('submit', handleEditAccount);
    if (editLinkForm) editLinkForm.addEventListener('submit', handleEditLink);
    if (reauthForm) reauthForm.addEventListener('submit', handleReauth);

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.fixed');
            if (modal) modal.classList.add('hidden');
        });
    });

    const cancelReauth = document.getElementById('cancelReauth');
    if (cancelReauth) cancelReauth.addEventListener('click', () => {
        isAuthenticatedToAdd = false;
        if (reauthModal) reauthModal.classList.add('hidden');
    });

    if (contactLoginBtn) contactLoginBtn.addEventListener('click', () => showModal('contactModal'));
    if (searchInput) searchInput.addEventListener('input', applyFiltersAndSearch);
    if (searchInputAdmin) searchInputAdmin.addEventListener('input', applyAdminLinksFilter);
    if (categoryFilterAdmin) categoryFilterAdmin.addEventListener('change', applyAdminLinksFilter);
    if (searchInputAccounts) searchInputAccounts.addEventListener('input', applyAccountsFilter);
    if (roleFilterAccounts) roleFilterAccounts.addEventListener('change', applyAccountsFilter);

    if (confirmDelete) confirmDelete.addEventListener('click', handleDelete);
    if (cancelDelete) cancelDelete.addEventListener('click', () => {
        deleteModal.classList.add('hidden');
        deleteType = '';
        deleteId = '';
    });

    // Profile buttons
    if (profileBtn) profileBtn.addEventListener('click', () => {
        populateProfileForm();
        showModal('profileModal');
    });
    if (mobileProfile) mobileProfile.addEventListener('click', () => {
        populateProfileForm();
        showModal('profileModal');
    });
    if (profileForm) profileForm.addEventListener('submit', handleUpdateProfile);

    // Category dropdown for user view
    if (categoryDropdownBtn) {
        categoryDropdownBtn.addEventListener('click', () => {
            categoryDropdown.classList.toggle('hidden');
        });
    }

    // Category suggestions for add link modal
    if (categoryToggle) {
        categoryToggle.addEventListener('click', () => {
            categorySuggestions.classList.toggle('hidden');
            populateCategorySuggestions('linkCategory', 'categorySuggestions');
        });
    }

    // Category suggestions for edit link modal
    if (editCategoryToggle) {
        editCategoryToggle.addEventListener('click', () => {
            editCategorySuggestions.classList.toggle('hidden');
            populateCategorySuggestions('editLinkCategory', 'editCategorySuggestions');
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!categoryDropdownBtn.contains(e.target) && !categoryDropdown.contains(e.target)) {
            categoryDropdown.classList.add('hidden');
        }
        
        if (!categoryToggle.contains(e.target) && !categorySuggestions.contains(e.target)) {
            categorySuggestions.classList.add('hidden');
        }
        
        if (!editCategoryToggle.contains(e.target) && !editCategorySuggestions.contains(e.target)) {
            editCategorySuggestions.classList.add('hidden');
        }
    });

    // Detail modal buttons
    if (detailEditBtn) detailEditBtn.addEventListener('click', () => {
        linkDetailModal.classList.add('hidden');
        if (currentLinkDetail) editLink(currentLinkDetail.id);
    });
    
    if (detailDeleteBtn) detailDeleteBtn.addEventListener('click', () => {
        linkDetailModal.classList.add('hidden');
        if (currentLinkDetail) deleteLink(currentLinkDetail.id);
    });

    // global error handlers
    window.addEventListener('error', (event) => {
        showErrorToast(`Error: ${event.message}`);
        console.error(event.error || event.message);
    });
    window.addEventListener('unhandledrejection', (event) => {
        showErrorToast(`Promise Error: ${event.reason}`);
        console.error(event.reason);
    });
}

function setupTheme() {
    const theme = localStorage.getItem('theme') || 'system';
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }
}

// --- API CALLS ---
async function fetchSheetData(sheetName) {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Gagal menghubungi Google Sheets (Status: ${response.status})`);
        }
        const text = await response.text();
        
        const jsonStrMatch = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/);
        if (!jsonStrMatch || jsonStrMatch.length < 2) {
            console.warn(`Sheet '${sheetName}' kosong atau format tidak dikenali.`);
            return [];
        }
        
        const data = JSON.parse(jsonStrMatch[1]);
        if (!data.table || !data.table.rows) {
            return [];
        }

        // KRUSIAL: Transformasi data yang benar
        const rows = data.table.rows.map(row => row.c.map(cell => (cell ? cell.v : null)));
        return rows;
    } catch (error) {
        console.error("Gagal mengambil data:", error);
        showErrorToast(`Gagal memuat data: ${error.message}`);
        return [];
    }
}

async function submitToWebhook(data) {
    showLoader();
    try {
        // Menggunakan mode no-cors untuk mengatasi masalah CORS
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        // Karena menggunakan no-cors, kita tidak bisa membaca respons
        // Jadi kita asumsikan berhasil jika tidak ada error
        showToast("Data berhasil ditambahkan!");
        return true;
    } catch (error) {
        console.error("Gagal mengirim data:", error);
        showErrorToast(`Gagal menambah data: ${error.message}`);
        return false;
    } finally {
        hideLoader();
    }
}

async function updateToWebhook(data) {    
    showLoader(); // Tambahkan loader agar konsisten
    console.log("Update Payload:", data);
    try {
        // Menggunakan mode no-cors untuk mengatasi masalah CORS
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        // Karena menggunakan no-cors, kita tidak bisa membaca respons
        // Jadi kita asumsikan berhasil jika tidak ada error
        console.log(response);
        showToast("Data berhasil diperbarui!");
        return true;
    } catch (error) {
        console.error("Gagal mengirim data:", error);
        showErrorToast(`Gagal memperbarui data: ${error.message}`);
        return false;
    } finally {
        hideLoader();
    }
}

async function deleteToWebhook(data) {
    showLoader();
    try {
        // Menggunakan mode no-cors untuk mengatasi masalah CORS
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        // Karena menggunakan no-cors, kita tidak bisa membaca respons
        // Jadi kita asumsikan berhasil jika tidak ada error
        showToast("Data berhasil dihapus!");
        return true;
    } catch (error) {
        console.error("Gagal mengirim data:", error);
        showErrorToast(`Gagal menghapus data: ${error.message}`);
        return false;
    } finally {
        hideLoader();
    }
}

// --- AUTHENTICATION ---
async function handleLogin(e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const passphrase = passphraseInput.value;

    if (!username || !passphrase) { showLoginError('Isi semua field.'); return; }

    showLoader();
    
    try {
        const accountsData = await fetchSheetData('accounts');
        
        if (!Array.isArray(accountsData)) {
            showLoginError('Format data akun tidak valid.');
            return;
        }

        if (accountsData.length === 0) {
            showLoginError('Tidak ada akun yang terdaftar di Google Sheets.');
            return;
        }

        const headers = accountsData.shift();
                
        // --- PERBAIKAN KRUSIAL: Validasi dan filter data akun ---
        allAccounts = accountsData.map(row => {
            let acc = {};
            headers.forEach((header, index) => {
                acc[header] = row[index];
            });
            // Validasi: pastikan akun memiliki semua properti yang diperlukan
            if (!acc.id || !acc.salt || !acc.username_hash || !acc.passphrase_hash || !acc.role) {
                console.warn("Melewati baris akun yang tidak valid atau tidak lengkap:", acc);
                return null; // Kembalikan null untuk baris yang tidak valid
            }
            return acc;
        }).filter(acc => acc !== null); // Hapus semua null dari hasil

        const account = allAccounts.find(acc => {
            const hashedUsername = CryptoJS.PBKDF2(username, CryptoJS.enc.Hex.parse(acc.salt), {
                keySize: 256/32, iterations: 2000, hasher: CryptoJS.algo.SHA256
            }).toString();
            
            const hashedPassphrase = CryptoJS.PBKDF2(passphrase, CryptoJS.enc.Hex.parse(acc.salt), {
                keySize: 256/32, iterations: 2000, hasher: CryptoJS.algo.SHA256
            }).toString();

            return hashedUsername === acc.username_hash && hashedPassphrase === acc.passphrase_hash;
        });

        if (account) {
            currentUser = account;
            loginScreen.classList.add('hidden');
            mainApp.classList.remove('hidden');
            bottomNav.classList.remove('hidden');
            userInfo.textContent = `${currentUser.account_name} (${currentUser.role})`;
            await loadAndRenderData();
            // Set up auto-refresh data every 5 minutes
            setupDataRefresh();
        } else {
            showLoginError('Username atau passphrase salah.');
        }
    } catch (error) {
        console.error("Error selama proses login:", error);
        showLoginError('Terjadi kesalahan saat menghubungkan server.');
    } finally {
        hideLoader();
    }
}

function setupDataRefresh() {
    // Clear any existing interval
    if (dataRefreshInterval) {
        clearInterval(dataRefreshInterval);
    }
    
    // Set new interval to refresh data every 5 minutes (300000 ms)
    dataRefreshInterval = setInterval(async () => {
        if (currentUser) {
            await loadAndRenderData();
            console.log('Data refreshed at', new Date().toLocaleTimeString());
        }
    }, 300000); // 5 minutes
}

function showLoginError(message) {
    if (!loginError) return;
    loginError.querySelector('span').textContent = message;
    loginError.classList.remove('hidden');
}

function handleLogout() {
    // Clear data refresh interval
    if (dataRefreshInterval) {
        clearInterval(dataRefreshInterval);
        dataRefreshInterval = null;
    }
    
    // Clear sensitive local state and UI
    currentUser = null;
    isAuthenticatedToAdd = false;
    allLinks = [];
    allAccounts = [];
    currentPage = 1;
    activeCategoryFilter = 'Semua';

    // Remove session-like items but preserve theme
    const theme = localStorage.getItem('theme');
    localStorage.clear();
    if (theme) localStorage.setItem('theme', theme);

    // Clear vault-specific items if any
    // e.g. localStorage.removeItem('vault_links');
    // hide UI
    mainApp.classList.add('hidden');
    bottomNav.classList.add('hidden');
    loginScreen.classList.remove('hidden');

    // clear form inputs & UI placeholders
    if (usernameInput) usernameInput.value = '';
    if (passphraseInput) passphraseInput.value = '';
    if (linksContainer) { linksContainer.innerHTML = ''; }
    if (linksTableBody) linksTableBody.innerHTML = '';
    if (accountsTableBody) accountsTableBody.innerHTML = '';
    if (noLinksMessage) noLinksMessage.classList.add('hidden');
}

async function handleReauth(e) {
    e.preventDefault();
    const username = (document.getElementById('reauthUsername').value || '').trim();
    const passphrase = document.getElementById('reauthPassphrase').value || '';

    if (!username || !passphrase) {
        reauthError && (reauthError.classList.remove('hidden'));
        return;
    }

    const account = allAccounts.find(acc => acc.id === currentUser?.id);
    if (!account) {
        reauthError && (reauthError.classList.remove('hidden'));
        return;
    }

    try {
        const hashedUsername = CryptoJS.PBKDF2(username, CryptoJS.enc.Hex.parse(account.salt), {
            keySize: 256/32, iterations: 2000, hasher: CryptoJS.algo.SHA256
        }).toString();
        const hashedPassphrase = CryptoJS.PBKDF2(passphrase, CryptoJS.enc.Hex.parse(account.salt), {
            keySize: 256/32, iterations: 2000, hasher: CryptoJS.algo.SHA256
        }).toString();

        if (hashedUsername === account.username_hash && hashedPassphrase === account.passphrase_hash) {
            isAuthenticatedToAdd = true;
            reauthModal.classList.add('hidden');
            reauthError && (reauthError.classList.add('hidden'));
            reauthForm.reset();
        } else {
            reauthError && (reauthError.classList.remove('hidden'));
        }
    } catch (err) {
        console.error("Reauth error:", err);
        reauthError && (reauthError.classList.remove('hidden'));
    }
}

// --- DATA LOADING & RENDERING ---
async function loadAndRenderData() {
    try {
        const accountsData = await fetchSheetData('accounts');
        const linksData = await fetchSheetData('links');

        if (!accountsData.length || !linksData.length) {
            showErrorToast('Data akun atau link kosong di Google Sheets.');
            return;
        }

        const accountHeaders = accountsData[0];
        const linkHeaders = linksData[0];

        allAccounts = accountsData.slice(1).map(row => {
            let acc = {};
            accountHeaders.forEach((header, i) => acc[header] = row[i]);
            return acc;
        }).filter(acc => acc.id && acc.role);

        allLinks = linksData.slice(1).map(row => {
            let link = {};
            linkHeaders.forEach((header, i) => link[header] = row[i]);
            return link;
        }).filter(link => link.id && link.title && link.url);

        // Extract all unique categories
        allCategories = [...new Set(allLinks.map(link => link.category || 'Umum'))];

        // Update current user data if exists
        if (currentUser) {
            currentUser = allAccounts.find(acc => acc.id === currentUser.id) || currentUser;
        }

        // Setelah login berhasil
        if (currentUser && currentUser.role === 'administrator') {
            adminNav.classList.remove('hidden');
            bottomNav.classList.add('hidden');
            userActions.classList.add('hidden');
            userGridView.classList.add('hidden');
            showAdminView('home');
        } else {
            adminNav.classList.add('hidden');
            userActions.classList.remove('hidden');
            bottomNav.classList.remove('hidden');
            adminHomeView.classList.add('hidden');
            adminLinksView.classList.add('hidden');
            adminAccountsView.classList.add('hidden');
            userGridView.classList.remove('hidden');
            renderCategoryFilters();
            applyFiltersAndSearch();
        }
    } catch (error) {
        console.error('loadAndRenderData error:', error);
        showErrorToast('Gagal memuat data.');
    }
}

// --- VIEWS ---
function showAdminView(view) {
    adminHomeView.classList.add('hidden');
    adminLinksView.classList.add('hidden');
    adminAccountsView.classList.add('hidden');
    showHomeViewBtn.classList.remove('bg-blue-500');
    showHomeViewBtn.classList.add('bg-gray-400');
    showLinksViewBtn.classList.remove('bg-blue-500');
    showLinksViewBtn.classList.add('bg-gray-400');
    showAccountsViewBtn.classList.remove('bg-blue-500');
    showAccountsViewBtn.classList.add('bg-gray-400');

    if (view === 'home') {
        adminHomeView.classList.remove('hidden');
        showHomeViewBtn.classList.remove('bg-gray-400');
        showHomeViewBtn.classList.add('bg-blue-500');
        renderAdminDashboard();
    } else if (view === 'links') {
        adminLinksView.classList.remove('hidden');
        showLinksViewBtn.classList.remove('bg-gray-400');
        showLinksViewBtn.classList.add('bg-blue-500');
        renderAdminLinksTable();
        populateCategoryFilter();
    } else {
        adminAccountsView.classList.remove('hidden');
        showAccountsViewBtn.classList.remove('bg-gray-400');
        showAccountsViewBtn.classList.add('bg-blue-500');
        renderAdminAccountsTable();
    }
}

function renderAdminDashboard() {
    totalLinks.textContent = allLinks.length;
    totalAccounts.textContent = allAccounts.length;
    adminAccounts.textContent = allAccounts.filter(acc => acc.role === 'administrator').length;
    
    // Find most recent update date
    if (allLinks.length > 0) {
        const sortedLinks = [...allLinks].sort((a, b) => {
            const dateA = new Date(a.LastUpdate || a.created_at || 0);
            const dateB = new Date(b.LastUpdate || b.LastUpdate || b.created_at || 0);
            return dateB - dateA;
        });
        
        if (sortedLinks[0] && (sortedLinks[0].LastUpdate || sortedLinks[0].created_at)) {
            const lastUpdateDate = new Date(sortedLinks[0].LastUpdate || sortedLinks[0].created_at);
            lastUpdate.textContent = lastUpdateDate.toLocaleDateString('id-ID');
        } else {
            lastUpdate.textContent = '-';
        }
    } else {
        lastUpdate.textContent = '-';
    }
}

function populateCategoryFilter() {
    const categories = [...new Set(allLinks.map(link => link.category || 'Umum'))];
    categoryFilterAdmin.innerHTML = '<option value="">Semua Kategori</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilterAdmin.appendChild(option);
    });
}

function populateCategorySuggestions(inputId, suggestionsId) {
    const input = document.getElementById(inputId);
    const suggestions = document.getElementById(suggestionsId);
    
    if (!input || !suggestions) return;
    
    suggestions.innerHTML = '';
    
    // Filter categories based on input
    const filteredCategories = allCategories.filter(cat => 
        cat.toLowerCase().includes(input.value.toLowerCase())
    );
    
    // Add suggestions
    filteredCategories.forEach(category => {
        const div = document.createElement('div');
        div.className = 'px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer';
        div.textContent = category;
        div.addEventListener('click', () => {
            input.value = category;
            suggestions.classList.add('hidden');
        });
        suggestions.appendChild(div);
    });
}

function applyAdminLinksFilter() {
    const searchTerm = (searchInputAdmin.value || '').toLowerCase();
    const categoryFilter = categoryFilterAdmin.value;
    
    let filteredLinks = allLinks;
    
    if (searchTerm) {
        filteredLinks = filteredLinks.filter(link =>
            (link.title || '').toLowerCase().includes(searchTerm) ||
            (link.url || '').toLowerCase().includes(searchTerm) ||
            ((link.notes || '').toLowerCase().includes(searchTerm))
        );
    }
    
    if (categoryFilter) {
        filteredLinks = filteredLinks.filter(link => (link.category || '') === categoryFilter);
    }
    
    renderAdminLinksTable(filteredLinks);
}

function applyAccountsFilter() {
    const searchTerm = (searchInputAccounts.value || '').toLowerCase();
    const roleFilter = roleFilterAccounts.value;
    
    let filteredAccounts = allAccounts;
    
    if (searchTerm) {
        filteredAccounts = filteredAccounts.filter(acc =>
            (acc.account_name || '').toLowerCase().includes(searchTerm) ||
            (acc.id || '').toLowerCase().includes(searchTerm)
        );
    }
    
    if (roleFilter) {
        filteredAccounts = filteredAccounts.filter(acc => (acc.role || '') === roleFilter);
    }
    
    renderAdminAccountsTable(filteredAccounts);
}

function renderAdminLinksTable(linksToRender = allLinks) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedLinks = linksToRender.slice(start, end);

    linksTableBody.innerHTML = '';
    paginatedLinks.forEach(link => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${escapeHtml(link.title)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">${escapeHtml(link.url)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${escapeHtml(link.category)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${escapeHtml(link.assigned_ids)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${escapeHtml(link.created_by)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="${link.url}" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline mr-3">Lihat</a>
                <button onclick="showLinkDetail('${link.id}')" class="text-green-600 hover:text-green-800 mr-3">Detail</button>
                <button onclick="editLink('${link.id}')" class="text-yellow-600 hover:text-yellow-800 mr-3">Edit</button>
                <button onclick="deleteLink('${link.id}')" class="text-red-600 hover:text-red-800">Hapus</button>
            </td>
        `;
        linksTableBody.appendChild(row);
    });
    renderPagination(linksToRender.length);
}

function renderPagination(totalItems) {
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const paginationContainer = document.getElementById('linksPagination');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        button.onclick = () => {
            currentPage = i;
            renderAdminLinksTable();
        };
        paginationContainer.appendChild(button);
    }
}

function renderAdminAccountsTable(accountsToRender = allAccounts) {
    accountsTableBody.innerHTML = '';
    accountsToRender.forEach(acc => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${escapeHtml(acc.account_name)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${escapeHtml(acc.role)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${escapeHtml(acc.id)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="editAccount('${acc.id}')" class="text-yellow-600 hover:text-yellow-800 mr-3">Edit</button>
                <button onclick="deleteAccount('${acc.id}')" class="text-red-600 hover:text-red-800">Hapus</button>
            </td>
        `;
        accountsTableBody.appendChild(row);
    });
}

function applyFiltersAndSearch() {
    if (!currentUser) return;
    const searchTerm = (searchInput.value || '').toLowerCase();
    let viewableLinks = [];

    try {
        if (currentUser.role === 'dinkes') {
            const puskesmasIds = allAccounts.filter(acc => acc.role === 'puskesmas').map(acc => acc.id);
            viewableLinks = allLinks.filter(link => {
                const assigned = (link.assigned_ids || '').split(',').map(x => x.trim()).filter(Boolean);
                return assigned.some(id => puskesmasIds.includes(id)) || assigned.includes(currentUser.id);
            });
        } else if (currentUser.role === 'puskesmas') {
            viewableLinks = allLinks.filter(link => {
                const assigned = (link.assigned_ids || '').split(',').map(x => x.trim()).filter(Boolean);
                return assigned.includes(currentUser.id);
            });
        } else { // user
            viewableLinks = allLinks.filter(link => {
                const assigned = (link.assigned_ids || '').split(',').map(x => x.trim()).filter(Boolean);
                return assigned.includes(currentUser.id);
            });
        }

        if (activeCategoryFilter !== 'Semua') {
            viewableLinks = viewableLinks.filter(link => (link.category || '') === activeCategoryFilter);
        }

        if (searchTerm) {
            viewableLinks = viewableLinks.filter(link =>
                (link.title || '').toLowerCase().includes(searchTerm) ||
                (link.url || '').toLowerCase().includes(searchTerm) ||
                ((link.notes || '').toLowerCase().includes(searchTerm))
            );
        }

        renderUserGrid(viewableLinks);
    } catch (err) {
        console.error("applyFiltersAndSearch error:", err);
        renderUserGrid([]);
    }
}

function renderUserGrid(linksToRender) {
    linksContainer.innerHTML = '';
    if (!linksToRender || linksToRender.length === 0) {
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
    card.className = 'link-card';
    const title = escapeHtml(link.title || 'Untitled');
    const url = link.url || '#';
    const category = escapeHtml(link.category || 'Umum');
    const imageUrl = link.image_url || '';
    
    const isOwner = (link.created_by === currentUser.id || link.created_by === currentUser.account_name);

    // Determine button layout
    let actionButtons = '';
    if (isOwner) {
        // Jika link milik sendiri → tampilkan Detail, Edit, Hapus
        actionButtons = `
            <div class="mt-2 flex justify-between">
                <button class="detail-card-btn flex-1 mr-1 py-1 text-center text-xs bg-blue-500 hover:bg-blue-600 text-white rounded" onclick="showLinkDetail('${link.id}')">
                    <i class="fas fa-info-circle"></i>
                </button>
                <button class="edit-card-btn flex-1 mr-1 py-1 text-center text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded" onclick="editLink('${link.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-card-btn flex-1 py-1 text-center text-xs bg-red-500 hover:bg-red-600 text-white rounded" onclick="deleteLink('${link.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    } else {
        // Jika bukan miliknya → tampilkan hanya tombol Detail
        actionButtons = `
            <div class="mt-2">
                <button class="detail-card-btn w-full py-1 text-center text-xs bg-blue-500 hover:bg-blue-600 text-white rounded" onclick="showLinkDetail('${link.id}')">
                    <i class="fas fa-info-circle mr-2"></i>Detail
                </button>
            </div>
        `;
    }

    card.innerHTML = `
        <div class="link-card-content">
            ${imageUrl ? `<img src="${imageUrl}" alt="${title}" class="w-full h-32 object-cover rounded-t-lg mb-2">` : ''}
            <h3 class="font-bold text-lg mb-2">${title}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">${escapeHtml(url)}</p>
            <span class="category-badge inline-block px-2 py-1 text-xs rounded" style="background-color:${generateCategoryColor(category)}">${category}</span>
        </div>
        <div class="link-card-actions">
            <button class="visit-page-btn" onclick="window.open('${url}','_blank')">
                <i class="fas fa-external-link-alt mr-2"></i>Kunjungi Halaman
            </button>
            ${actionButtons}
        </div>
    `;
    return card;
}

function generateCategoryColor(category) {
    let hash = 0;
    for (let i = 0; i < (category || '').length; i++) {
        hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 65%, 60%)`;
}

function renderCategoryFilters() {
    const categories = ['Semua', ...allCategories];
    const dropdownContent = categoryDropdown.querySelector('.p-2');
    
    dropdownContent.innerHTML = '';
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-filter-btn w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded';
        button.textContent = category;
        button.dataset.category = category;
        
        if (category === activeCategoryFilter) {
            button.classList.add('bg-blue-100', 'dark:bg-blue-900/30');
        }
        
        button.addEventListener('click', () => {
            activeCategoryFilter = category;
            document.getElementById('selectedCategory').textContent = category;
            renderCategoryFilters();
            applyFiltersAndSearch();
            categoryDropdown.classList.add('hidden');
        });
        
        dropdownContent.appendChild(button);
    });
}

// --- FORM HANDLERS ---
function handleAddLink(e) {
    e.preventDefault();
    if (!isAuthenticatedToAdd) {
        showModal('reauthModal');
        return;
    }
    const title = (document.getElementById('linkTitle').value || '').trim();
    const url = (document.getElementById('linkUrl').value || '').trim();
    const imageUrl = (document.getElementById('linkImageUrl').value || '').trim();
    const category = (document.getElementById('linkCategory').value || '').trim() || 'Umum';
    const notes = (document.getElementById('linkNotes').value || '').trim();

    if (!title || !url) {
        showErrorToast('Judul dan URL wajib diisi.');
        return;
    }

    let assignedIds = currentUser.id;
    if (currentUser.role === 'administrator') {
        const checkboxes = multiSelectContainer.querySelectorAll('input[type="checkbox"]:checked');
        assignedIds = Array.from(checkboxes).map(cb => cb.value).join(',');
    } else if (currentUser.role === 'dinkes') {
        // For dinkes role, assign to self and all puskesmas
        const puskesmasIds = allAccounts.filter(acc => acc.role === 'puskesmas').map(acc => acc.id);
        assignedIds = [currentUser.id, ...puskesmasIds].join(',');
    }

    const payload = {
        action: 'create',
        sheetName: 'links',
        rowData: {
            id: `link-${Date.now()}`,
            title, url, image_url: imageUrl, category, notes,
            assigned_ids: assignedIds,
            created_by: currentUser.account_name || currentUser.id,
            created_at: new Date().toISOString(),
            LastUpdate: new Date().toISOString()
        }
    };

    submitToWebhook(payload).then(success => {
        if (success) {
            addLinkModal.classList.add('hidden');
            addLinkForm.reset();
            loadAndRenderData();
        }
    });
}

function handleEditLink(e) {
    e.preventDefault();
    if (!isAuthenticatedToAdd) {
        showModal('reauthModal');
        return;
    }
    
    const id = document.getElementById('editLinkId').value;
    const title = (document.getElementById('editLinkTitle').value || '').trim();
    const url = (document.getElementById('editLinkUrl').value || '').trim();
    const imageUrl = (document.getElementById('editLinkImageUrl').value || '').trim();
    const category = (document.getElementById('editLinkCategory').value || '').trim() || 'Umum';
    const notes = (document.getElementById('editLinkNotes').value || '').trim();

    if (!title || !url) {
        showErrorToast('Judul dan URL wajib diisi.');
        return;
    }

    let assignedIds = currentUser.id;
    if (currentUser.role === 'administrator') {
        const checkboxes = editMultiSelectContainer.querySelectorAll('input[type="checkbox"]:checked');
        assignedIds = Array.from(checkboxes).map(cb => cb.value).join(',');
    } else if (currentUser.role === 'dinkes') {
        // For dinkes role, assign to self and all puskesmas
        const puskesmasIds = allAccounts.filter(acc => acc.role === 'puskesmas').map(acc => acc.id);
        assignedIds = [currentUser.id, ...puskesmasIds].join(',');
    }

    // Get the original link to preserve created_by
    const originalLink = allLinks.find(l => l.id === id);
    
    const payload = {
        action: 'update',
        sheetName: 'links',
        rowData: {
            id, title, url, image_url: imageUrl, category, notes,
            assigned_ids: assignedIds,
            created_by: originalLink ? originalLink.created_by : currentUser.account_name || currentUser.id,
            LastUpdate: new Date().toISOString()
        }
    };

    updateToWebhook(payload).then(success => {
        if (success) {
            editLinkModal.classList.add('hidden');
            editLinkForm.reset();
            loadAndRenderData();
        }
    });
}

function handleAddAccount(e) {
    e.preventDefault();
    if (!isAuthenticatedToAdd) {
        showModal('reauthModal');
        return;
    }

    const salt = CryptoJS.lib.WordArray.random(128/8).toString();
    const username = (document.getElementById('accountUsername').value || '').trim();
    const passphrase = document.getElementById('accountPassphrase').value || '';

    if (!username || !passphrase) {
        showErrorToast('Username dan passphrase wajib diisi.');
        return;
    }

    const payload = {
        action: 'create',
        sheetName: 'accounts',
        rowData: {
            id: document.getElementById('accountId').value || `acct-${Date.now()}`,
            role: document.getElementById('accountRole').value,
            account_name: document.getElementById('accountName').value || username,
            username_hash: CryptoJS.PBKDF2(username, CryptoJS.enc.Hex.parse(salt), { keySize: 256/32, iterations: 2000, hasher: CryptoJS.algo.SHA256 }).toString(),
            passphrase_hash: CryptoJS.PBKDF2(passphrase, CryptoJS.enc.Hex.parse(salt), { keySize: 256/32, iterations: 2000, hasher: CryptoJS.algo.SHA256 }).toString(),
            salt: salt
        }
    };

    submitToWebhook(payload).then(success => {
        if (success) {
            addAccountModal.classList.add('hidden');
            addAccountForm.reset();
            loadAndRenderData();
        }
    });
}

function handleEditAccount(e) {
    e.preventDefault();

    if (!isAuthenticatedToAdd) {
        showModal('reauthModal');
        return;
    }

    const id = document.getElementById('editAccountId').value;
    const accountName = (document.getElementById('editAccountName').value || '').trim();
    const role = document.getElementById('editAccountRole').value || 'user';
    const salt = CryptoJS.lib.WordArray.random(128/8).toString();
    const username = (document.getElementById('editAccountUsername').value || '').trim();
    const passphrase = (document.getElementById('editAccountPassphrase').value || '').trim();

    if (!accountName || !username || !passphrase) {
        showErrorToast('Nama Akun, Username dan passphrase wajib diisi.');
        return;
    }

    const payload = {
        action: 'update',
        sheetName: 'accounts',
        rowData: {
            id: id,
            account_name: accountName,
            username_hash: CryptoJS.PBKDF2(username, CryptoJS.enc.Hex.parse(salt), { keySize: 256/32, iterations: 2000, hasher: CryptoJS.algo.SHA256 }).toString(),
            passphrase_hash: CryptoJS.PBKDF2(passphrase, CryptoJS.enc.Hex.parse(salt), { keySize: 256/32, iterations: 2000, hasher: CryptoJS.algo.SHA256 }).toString(),
            salt: salt,
            role: role,
        }
    };

    console.log("Edit Account Payload:", payload);

    updateToWebhook(payload).then(success => {
        if (success) {
            // showToast("Akun berhasil diperbarui.");
            // Ganti ID modal jika berbeda
            editAccountModal.classList.add('hidden');
            editAccountForm.reset();
            loadAndRenderData();
        }
    });
}

function handleUpdateProfile(e) {
    e.preventDefault();
    const id = document.getElementById('profileAccountId').value;
    const accountName = document.getElementById('profileAccountName').value;
    const username = document.getElementById('profileAccountUsername').value;
    const currentPassphrase = document.getElementById('profileCurrentPassphrase').value;
    const newPassphrase = document.getElementById('profileNewPassphrase').value;
    const confirmPassphrase = document.getElementById('profileConfirmPassphrase').value;

    if (!accountName || !username || !currentPassphrase) {
        showErrorToast('Nama akun, username, dan passphrase saat ini wajib diisi.');
        return;
    }

    if (newPassphrase && newPassphrase !== confirmPassphrase) {
        showErrorToast('Passphrase baru dan konfirmasi tidak cocok.');
        return;
    }

    const account = allAccounts.find(acc => acc.id === id);
    if (!account) {
        showErrorToast('Akun tidak ditemukan.');
        return;
    }

    // Verifikasi passphrase saat ini (Logika Anda sudah sempurna)
    const hashedCurrentPassphrase = CryptoJS.PBKDF2(currentPassphrase, CryptoJS.enc.Hex.parse(account.salt), {
        keySize: 256/32, iterations: 2000, hasher: CryptoJS.algo.SHA256
    }).toString();

    if (hashedCurrentPassphrase !== account.passphrase_hash) {
        showErrorToast('Passphrase saat ini tidak valid.');
        return;
    }

    // --- LOGIKA BARU DIMULAI DI SINI ---

    // 1. Siapkan payload dasar
    const payload = {
        action: 'update',
        sheetName: 'accounts',
        rowData: {
            id,
            account_name: accountName,
            role: account.role, // Pertahankan role
        }
    };

    // 2. Tentukan 'salt' yang akan kita gunakan
    let saltToUse = account.salt; // Secara default, gunakan salt lama
    
    // 3. Cek apakah passphrase diubah. JIKA YA, buat salt BARU.
    if (newPassphrase) {
        console.log("Membuat salt baru untuk passphrase baru...");
        saltToUse = CryptoJS.lib.WordArray.random(128/8).toString(); // Buat salt BARU
        
        // Tambahkan hash passphrase BARU (dibuat dgn salt BARU) ke payload
        payload.rowData.passphrase_hash = CryptoJS.PBKDF2(newPassphrase, CryptoJS.enc.Hex.parse(saltToUse), { 
                keySize: 256/32, iterations: 2000, hasher: CryptoJS.algo.SHA256
            }).toString();
        
        // Tambahkan salt BARU ke payload
        payload.rowData.salt = saltToUse;
    }
    // Jika tidak ada passphrase baru, kita tidak menambahkan 'passphrase_hash' atau 'salt'
    // ke payload. Logika Apps Script kita akan mempertahankan nilai lama.

    // 4. SELALU buat hash untuk username.
    //    Ini akan menggunakan 'saltToUse' (yang bisa jadi lama ATAU baru)
    console.log("Membuat hash username menggunakan salt yang ditentukan.");
    payload.rowData.username_hash = CryptoJS.PBKDF2(username, CryptoJS.enc.Hex.parse(saltToUse), { 
        keySize: 256/32, iterations: 2000, hasher: CryptoJS.algo.SHA256
    }).toString();
    
    // --- LOGIKA BARU SELESAI ---

    console.log("Payload Update Profile:", payload);

    updateToWebhook(payload).then(success => {
        if (success) {
            profileModal.classList.add('hidden');
            profileForm.reset();
            
            // Logika post-update Anda sudah sempurna
            if (id === currentUser.id) {
                if (newPassphrase) {
                    // User ganti passphrase, paksa login ulang
                    handleLogout();
                    showLoginError('Passphrase berhasil diubah. Silakan login kembali.');
                } else {
                    // Jika hanya ganti nama/username, muat ulang data
                    loadAndRenderData();
                }
            } else {
                // Admin mengedit profil orang lain
                loadAndRenderData();
            }
        }
    });
}

function handleDelete() {
    if (!deleteType || !deleteId) return;

    const payload = {
        action: 'delete',
        sheetName: deleteType,
        id: deleteId
    };

    deleteToWebhook(payload).then(success => {
        if (success) {
            deleteModal.classList.add('hidden');
            deleteType = '';
            deleteId = '';
            loadAndRenderData();
        }
    });
}

function showLinkDetail(id) {
    const link = allLinks.find(l => l.id === id);
    if (!link) return;

    currentLinkDetail = link;
    
    // Populate detail modal
    detailTitle.textContent = link.title || '';
    detailUrl.href = link.url || '#';
    detailUrl.textContent = link.url || '';
    
    if (link.image_url) {
        detailImage.src = link.image_url;
        detailImage.alt = link.title || '';
        detailImageContainer.classList.remove('hidden');
    } else {
        detailImageContainer.classList.add('hidden');
    }
    
    detailCategory.textContent = link.category || '';
    detailNotes.textContent = link.notes || 'Tidak ada catatan';
    detailAssigned.textContent = link.assigned_ids || '';
    detailCreatedBy.textContent = link.created_by || '';
    
    if (link.created_at) {
        const createdDate = new Date(link.created_at);
        detailCreatedAt.textContent = createdDate.toLocaleString('id-ID');
    } else {
        detailCreatedAt.textContent = '-';
    }
    
    if (link.LastUpdate) {
        const updateDate = new Date(link.LastUpdate);
        detailLastUpdate.textContent = updateDate.toLocaleString('id-ID');
    } else {
        detailLastUpdate.textContent = '-';
    }
    
    // Show/hide edit and delete buttons based on permissions
    const canEdit = currentUser.role === 'administrator' || 
                   (currentUser.id === link.created_by || currentUser.account_name === link.created_by);
    
    detailEditBtn.style.display = canEdit ? 'block' : 'none';
    detailDeleteBtn.style.display = canEdit ? 'block' : 'none';
    
    showModal('linkDetailModal');
}

function editLink(id) {
    const link = allLinks.find(l => l.id === id);
    if (!link) return;

    document.getElementById('editLinkId').value = link.id;
    document.getElementById('editLinkTitle').value = link.title;
    document.getElementById('editLinkUrl').value = link.url;
    document.getElementById('editLinkImageUrl').value = link.image_url || '';
    document.getElementById('editLinkCategory').value = link.category;
    document.getElementById('editLinkNotes').value = link.notes || '';

    if (currentUser.role === 'administrator') {
        document.getElementById('editAdminAssignment').classList.remove('hidden');
        editMultiSelectContainer.innerHTML = '';
        
        const assignedIds = (link.assigned_ids || '').split(',').map(id => id.trim());
        
        allAccounts.forEach(acc => {
            const label = document.createElement('label');
            label.className = 'multi-select-checkbox flex items-center';
            label.innerHTML = `
                <input type="checkbox" value="${escapeHtml(acc.id)}" class="mr-2" ${assignedIds.includes(acc.id) ? 'checked' : ''}>
                <span class="text-white">${escapeHtml(acc.account_name)} (${escapeHtml(acc.id)})</span>
            `;
            editMultiSelectContainer.appendChild(label);
        });
    } else {
        document.getElementById('editAdminAssignment').classList.add('hidden');
    }

    showModal('editLinkModal');
}

function deleteLink(id) {
    deleteType = 'links';
    deleteId = id;
    showModal('deleteModal');
}

function editAccount(id) {
    console.log("Editing account with ID:", id);
    const account = allAccounts.find(a => a.id === id);

    console.log("Found account:", account);
    if (!account) return;

    document.getElementById('editAccountId').value = account.id;
    document.getElementById('editAccountName').value = account.account_name;
    document.getElementById('editAccountRole').value = account.role;
    // document.getElementById('editAccountUsername').value = account.username || ''; // Clear username field
    // document.getElementById('editAccountPassphrase').value = account.passphrase || ''; // Clear passphrase field

    showModal('editAccountModal');
}

function deleteAccount(id) {
    deleteType = 'accounts';
    deleteId = id;
    showModal('deleteModal');
}

function populateProfileForm() {
    if (!currentUser) return;
    
    document.getElementById('profileAccountId').value = currentUser.id;
    document.getElementById('profileAccountName').value = currentUser.account_name || '';
    document.getElementById('profileAccountUsername').value = currentUser.username || '';
}

// --- UTILS & UI ---
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    // ensure admin-only UI hidden when not admin
    if (modalId === 'addLinkModal') {
        const adminAssignment = document.getElementById('adminAssignment');
        if (adminAssignment) adminAssignment.classList.toggle('hidden', currentUser?.role !== 'administrator');
        if (currentUser?.role === 'administrator') populateMultiSelect();
    }
    modal.classList.remove('hidden');
}

function showLoader() {
    if (loader) loader.classList.remove('hidden');
}

function hideLoader() {
    if (loader) loader.classList.add('hidden');
}

function populateMultiSelect() {
    multiSelectContainer.innerHTML = '';
    allAccounts.forEach(acc => {
        const label = document.createElement('label');
        label.className = 'multi-select-checkbox flex items-center';
        label.innerHTML = `
            <input type="checkbox" value="${escapeHtml(acc.id)}" class="mr-2">
            <span class="text-white">${escapeHtml(acc.account_name)} (${escapeHtml(acc.id)})</span>
        `;
        multiSelectContainer.appendChild(label);
    });
}

function showToast(message, type = 'success') {
    try {
        toastMessage.textContent = message;
        toast.className = `fixed top-4 right-4 px-4 py-2 rounded-md shadow-md transform transition-transform duration-300 z-50 ${type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white`;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    } catch (e) { console.warn("showToast error", e); }
}

function showErrorToast(message) {
    try {
        errorToastMessage.textContent = message;
        errorToast.classList.remove('hidden');
        setTimeout(() => errorToast.classList.add('hidden'), 5000);
    } catch (e) { console.warn("showErrorToast error", e); }
}

function escapeHtml(unsafe) {
    if (unsafe === undefined || unsafe === null) return '';
    return String(unsafe)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}