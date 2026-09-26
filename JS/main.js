document.addEventListener('DOMContentLoaded', () => {
    // Default initial products if storage is empty
    const defaultProducts = [
        {
            id: 1,
            title: "Canon EOS R6",
            category: "used",
            badge: "Used • Grade A",
            desc: "Includes EF-EOS R Adapter & 1 Battery. Low shutter count.",
            price: "1,850,000 RWF",
            icon: "fa-camera-retro",
            isSold: false
        },
        {
            id: 2,
            title: "Sony FX30 Cinema Line",
            category: "new",
            badge: "Brand New",
            desc: "Body only, boxed with full manufacturer warranty.",
            price: "2,100,000 RWF",
            icon: "fa-video",
            isSold: false
        },
        {
            id: 3,
            title: "Sigma 24-70mm f/2.8 DG DN",
            category: "used",
            badge: "Used • Grade B+",
            desc: "E-Mount lens, pristine glass, minor barrel wear.",
            price: "950,000 RWF",
            icon: "fa-camera-rotate",
            isSold: false
        }
    ];

    // Load products from LocalStorage or initialize defaults
    function getProducts() {
        const stored = localStorage.getItem('nyirikamera_products');
        if (!stored) {
            localStorage.setItem('nyirikamera_products', JSON.stringify(defaultProducts));
            return defaultProducts;
        }
        return JSON.parse(stored);
    }

    function saveProducts(products) {
        localStorage.setItem('nyirikamera_products', JSON.stringify(products));
    }

    // Render Storefront Grid
    function renderShop(filter = 'all') {
        const grid = document.getElementById('gear-grid');
        if (!grid) return;
        
        const products = getProducts();
        grid.innerHTML = '';

        const filtered = products.filter(p => {
            if (filter === 'all') return true;
            return p.category === filter;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500">No gear found in this category.</div>`;
            return;
        }

        filtered.forEach(p => {
            const soldBadge = p.isSold 
                ? `<span class="absolute top-3 left-3 bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold px-3 py-1 rounded-full uppercase z-10">SOLD OUT</span>`
                : `<span class="absolute top-3 left-3 bg-amber-500/20 border border-accent/40 text-accent text-xs font-bold px-3 py-1 rounded-full uppercase z-10">${p.badge}</span>`;

            const inquiryButton = p.isSold
                ? `<button disabled class="w-full bg-gray-800 text-gray-500 font-semibold py-3 rounded-xl cursor-not-allowed">Item Sold Out</button>`
                : `<a href="https://wa.me/250782815825?text=Hello%20Nyirikamera!%20I%20am%20interested%20in%20buying%20the%20${encodeURIComponent(p.title)}%20listed%20at%20${encodeURIComponent(p.price)}." target="_blank"
                     class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all">
                     <i class="fa-brands fa-whatsapp text-lg"></i>
                     <span>Inquire on WhatsApp</span>
                   </a>`;

            const card = document.createElement('div');
            card.className = `bg-cardBg border border-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between ${p.isSold ? 'opacity-75' : ''}`;
            card.innerHTML = `
                <div>
                    <div class="h-56 bg-gray-900 flex items-center justify-center relative">
                        ${soldBadge}
                        <i class="fa-solid ${p.icon} text-gray-700 text-6xl"></i>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-white mb-1">${p.title}</h3>
                        <p class="text-gray-400 text-sm mb-4">${p.desc}</p>
                        <div class="text-2xl font-extrabold text-accent">${p.price}</div>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    ${inquiryButton}
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Render Admin Inventory Manager List
    function renderAdminList() {
        const listContainer = document.getElementById('admin-inventory-list');
        if (!listContainer) return;

        const products = getProducts();
        listContainer.innerHTML = '';

        if (products.length === 0) {
            listContainer.innerHTML = `<p class="text-xs text-gray-500">No inventory available.</p>`;
            return;
        }

        products.forEach(p => {
            const row = document.createElement('div');
            row.className = 'flex items-center justify-between bg-gray-900 p-3 rounded-xl border border-gray-800';
            row.innerHTML = `
                <div class="flex items-center space-x-3">
                    <span class="text-sm font-bold text-white">${p.title}</span>
                    <span class="text-xs text-accent">${p.price}</span>
                    ${p.isSold ? '<span class="text-xs bg-red-900/40 text-red-400 px-2 py-0.5 rounded">Sold</span>' : '<span class="text-xs bg-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded">Active</span>'}
                </div>
                <div class="flex items-center space-x-2">
                    <button data-id="${p.id}" class="toggle-sold-btn text-xs px-3 py-1.5 rounded-lg ${p.isSold ? 'bg-gray-700 text-white' : 'bg-amber-600/30 text-accent border border-accent/30'} hover:opacity-80">
                        ${p.isSold ? 'Mark Available' : 'Mark Sold'}
                    </button>
                    <button data-id="${p.id}" class="delete-item-btn text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-2.5 py-1.5 rounded-lg hover:bg-red-600 hover:text-white">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            listContainer.appendChild(row);
        });

        // Attach event listeners for admin actions
        document.querySelectorAll('.toggle-sold-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                toggleSoldStatus(id);
            });
        });

        document.querySelectorAll('.delete-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                deleteProduct(id);
            });
        });
    }

    function toggleSoldStatus(id) {
        let products = getProducts();
        products = products.map(p => {
            if (p.id === id) {
                p.isSold = !p.isSold;
            }
            return p;
        });
        saveProducts(products);
        renderShop(getCurrentFilter());
        renderAdminList();
    }

    function deleteProduct(id) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        saveProducts(products);
        renderShop(getCurrentFilter());
        renderAdminList();
    }

    function getCurrentFilter() {
        const activeBtn = document.querySelector('.filter-btn.active');
        return activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    }

    // Filter Button Click Handlers
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active', 'bg-accent', 'text-black');
                b.classList.add('text-gray-400');
            });
            e.currentTarget.classList.add('active', 'bg-accent', 'text-black');
            e.currentTarget.classList.remove('text-gray-400');
            
            renderShop(e.currentTarget.getAttribute('data-filter'));
        });
    });

    // Admin Modal Open / Close Logic
    const adminModal = document.getElementById('admin-modal');
    const openAdminBtn = document.getElementById('open-admin-btn');
    const closeAdminBtn = document.getElementById('close-admin-btn');

    if (openAdminBtn && adminModal) {
        openAdminBtn.addEventListener('click', () => {
            adminModal.classList.remove('hidden');
            renderAdminList();
        });
    }

    if (closeAdminBtn && adminModal) {
        closeAdminBtn.addEventListener('click', () => {
            adminModal.classList.add('hidden');
        });
    }

    // Add Product Form Submission
    const addForm = document.getElementById('add-product-form');
    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newProduct = {
                id: Date.now(),
                title: document.getElementById('p-title').value,
                price: document.getElementById('p-price').value,
                category: document.getElementById('p-category').value,
                badge: document.getElementById('p-badge').value || 'Verified Gear',
                desc: document.getElementById('p-desc').value,
                icon: document.getElementById('p-icon').value,
                isSold: false
            };

            const products = getProducts();
            products.unshift(newProduct); // Add to beginning of array
            saveProducts(products);

            addForm.reset();
            renderShop(getCurrentFilter());
            renderAdminList();
            alert('Product successfully published to your live storefront!');
        });
    }

    // Trade-in WhatsApp form handler
    const tradeinForm = document.getElementById('tradein-form');
    if (tradeinForm) {
        tradeinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('item-name').value;
            const condition = document.getElementById('item-condition').value;
            const accessories = document.getElementById('item-accessories').value || 'None';
            const price = document.getElementById('item-price').value || 'Negotiable';

            const whatsappUrl = `https://wa.me/250782815825?text=` + 
                encodeURIComponent(`Hello Nyirikamera! I want to sell/trade-in my gear:\n\n• Item: ${name}\n• Condition: ${condition}\n• Accessories: ${accessories}\n• Expected Price: ${price}`);
            
            window.open(whatsappUrl, '_blank');
        });
    }

    // Initial load
    renderShop('all');
});