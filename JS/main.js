document.addEventListener('DOMContentLoaded', () => {
    const defaultProducts = [
        { id: 1, title: "Sony a7 IV Mirrorless Camera", category: "photography", price: "2,400,000 RWF", oldPrice: "2,500,000 RWF", discount: "-2%", stock: "1 in Stock", icon: "fa-camera", isSold: false },
        { id: 2, title: "Sony FX30 Digital Cinema Camera", category: "videography", price: "2,350,000 RWF", oldPrice: "3,000,000 RWF", discount: "-3%", stock: "1 in Stock", icon: "fa-video", isSold: false },
        { id: 3, title: "Shure SM7B Professional Microphone", category: "audio", price: "290,000 RWF", oldPrice: "500,000 RWF", discount: "-2%", stock: "2 in Stock", icon: "fa-microphone", isSold: false },
        { id: 4, title: "Godox AD300Pro Outdoor Flash", category: "lighting", price: "700,000 RWF", oldPrice: "900,000 RWF", discount: "-3%", stock: "1 in Stock", icon: "fa-bolt", isSold: false }
    ];

    function getProducts() {
        const stored = localStorage.getItem('nyirikamera_products');
        if (!stored || stored === "[]") {
            localStorage.setItem('nyirikamera_products', JSON.stringify(defaultProducts));
            return defaultProducts;
        }
        try {
            return JSON.parse(stored);
        } catch (e) {
            localStorage.setItem('nyirikamera_products', JSON.stringify(defaultProducts));
            return defaultProducts;
        }
    }

    function saveProducts(products) {
        localStorage.setItem('nyirikamera_products', JSON.stringify(products));
    }

    function renderProducts(category = 'all') {
        const grid = document.getElementById('product-grid');
        if (!grid) return;

        const products = getProducts();
        grid.innerHTML = '';

        // Normalize filter check (supports both 'all' and 'All Gear')
        const filtered = (category === 'all' || category === 'All Gear') 
            ? products 
            : products.filter(p => p.category.toLowerCase() === category.toLowerCase());

        if (filtered.length === 0) {
            grid.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500 text-sm">No items found in this category. Click 'Admin Panel' above to add gear!</div>`;
            return;
        }

        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = "bg-cardBg border border-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-gray-700 transition-all";
            card.innerHTML = `
                <a href="product.html?id=${p.id}" class="block">
                    <div class="h-48 bg-gray-950 flex items-center justify-center relative">
                        <span class="absolute top-2.5 left-2.5 bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">${p.discount || 'New'}</span>
                        <i class="fa-solid ${p.icon || 'fa-camera'} text-gray-700 text-5xl"></i>
                    </div>
                    <div class="p-4">
                        <span class="text-[10px] uppercase font-bold text-accent tracking-wider">${p.stock || 'In Stock'}</span>
                        <h3 class="text-sm font-bold text-white mt-1 mb-2 line-clamp-2 hover:text-accent transition-colors">${p.title}</h3>
                        <div class="flex items-center space-x-2">
                            <span class="text-base font-black text-accent">${p.price}</span>
                            ${p.oldPrice ? `<span class="text-xs text-gray-500 line-through">${p.oldPrice}</span>` : ''}
                        </div>
                    </div>
                </a>
                <div class="p-4 pt-0">
                    <a href="https://wa.me/250782815825?text=Hello%20Nyirikamera,%20I%20want%20to%20buy%20${encodeURIComponent(p.title)}" target="_blank"
                       class="w-full bg-gray-900 hover:bg-emerald-600 hover:text-white text-gray-300 text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all border border-gray-800">
                        <i class="fa-brands fa-whatsapp text-sm"></i>
                        <span>Whatsapp</span>
                    </a>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function renderAdminList() {
        const list = document.getElementById('admin-inventory-list');
        if (!list) return;
        const products = getProducts();
        list.innerHTML = '';
        
        if (products.length === 0) {
            list.innerHTML = `<div class="text-gray-500 text-xs text-center py-2">No inventory items.</div>`;
            return;
        }

        products.forEach(p => {
            const row = document.createElement('div');
            row.className = 'flex items-center justify-between bg-gray-900 p-2.5 rounded-xl border border-gray-800 text-xs';
            row.innerHTML = `
                <span class="text-white font-medium">${p.title}</span>
                <button data-id="${p.id}" class="del-btn bg-red-600/20 text-red-400 px-2 py-1 rounded-lg hover:bg-red-600 hover:text-white transition-colors">Delete</button>
            `;
            list.appendChild(row);
        });

        document.querySelectorAll('.del-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                const updated = getProducts().filter(item => item.id !== id);
                saveProducts(updated);
                renderProducts(getCurrentCategory());
                renderAdminList();
            });
        });
    }

    function getCurrentCategory() {
        const active = document.querySelector('.cat-pill.active');
        return active ? active.getAttribute('data-category') : 'all';
    }

    // Category filter pills click handler
    document.querySelectorAll('.cat-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            document.querySelectorAll('.cat-pill').forEach(p => {
                p.classList.remove('active', 'bg-accent', 'text-black');
                p.classList.add('bg-cardBg', 'text-gray-300');
            });
            e.currentTarget.classList.remove('bg-cardBg', 'text-gray-300');
            e.currentTarget.classList.add('active', 'bg-accent', 'text-black');
            
            const cat = e.currentTarget.getAttribute('data-category');
            renderProducts(cat);
        });
    });

    // Admin modal triggers
    const modal = document.getElementById('admin-modal');
    const openBtn = document.getElementById('open-admin-btn');
    const closeBtn = document.getElementById('close-admin-btn');

    if (openBtn) openBtn.addEventListener('click', () => { modal.classList.remove('hidden'); renderAdminList(); });
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

    // Form submission
    const form = document.getElementById('add-product-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newP = {
                id: Date.now(),
                title: document.getElementById('p-title').value,
                price: document.getElementById('p-price').value,
                oldPrice: document.getElementById('p-oldprice').value,
                category: document.getElementById('p-category').value,
                discount: document.getElementById('p-discount').value || '-2% new',
                stock: document.getElementById('p-stock').value || '1 in Stock',
                icon: 'fa-camera'
            };
            const products = getProducts();
            products.unshift(newP);
            saveProducts(products);
            form.reset();
            renderProducts(getCurrentCategory());
            renderAdminList();
            alert('Item published successfully!');
        });
    }

    // Initial render on page load
    renderProducts('all');
});