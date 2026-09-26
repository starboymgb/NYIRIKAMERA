document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Gear Shop Filter Tabs
    const filterButtons = document.querySelectorAll('.filter-btn');
    const gearCards = document.querySelectorAll('.gear-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-accent', 'text-black');
                btn.classList.add('text-gray-400');
            });

            // Add active class to clicked button
            button.classList.add('active', 'bg-accent', 'text-black');
            button.classList.remove('text-gray-400');

            const filterValue = button.getAttribute('data-filter');

            gearCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Trade-In Form WhatsApp Redirect Generator
    const tradeinForm = document.getElementById('tradein-form');
    if (tradeinForm) {
        tradeinForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const itemName = document.getElementById('item-name').value.trim();
            const itemCondition = document.getElementById('item-condition').value;
            const itemAccessories = document.getElementById('item-accessories').value.trim() || 'None specified';
            const itemPrice = document.getElementById('item-price').value.trim() || 'Open to offer';

            const whatsappMessage = `Hello Nyirikamera! I want to sell/trade-in some gear:%0A%0A*Item(s):* ${encodeURIComponent(itemName)}%0A*Condition:* ${encodeURIComponent(itemCondition)}%0A*Included Accessories:* ${encodeURIComponent(itemAccessories)}%0A*Expected Price:* ${encodeURIComponent(itemPrice)}`;

            const whatsappUrl = `https://wa.me/250782815825?text=${whatsappMessage}`;
            window.open(whatsappUrl, '_blank');
        });
    }
});