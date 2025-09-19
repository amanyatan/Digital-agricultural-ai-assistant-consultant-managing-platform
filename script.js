// Global variables
let currentUser = null;
let currentTheme = localStorage.getItem('theme') || 'light';
let currentSection = 'landing';
let listings = JSON.parse(localStorage.getItem('listings')) || [];
let chatMessages = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    createStarfield();
    createFloatingPatterns();
    setupScrollTriggers();
    setupParallax();
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        if (currentUser.type === 'farmer') {
            showFarmerDashboard();
        } else {
            showCompanyDashboard();
        }
    }
    
    loadListings();
});

// Theme Management
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    
    // Smooth theme transition
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

function updateThemeIcon() {
    const themeButtons = document.querySelectorAll('.theme-toggle');
    themeButtons.forEach(btn => {
        btn.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    });
}

// Starfield Animation
function createStarfield() {
    const starfield = document.getElementById('starfield');
    const numberOfStars = 100;
    
    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 2 + 2) + 's';
        starfield.appendChild(star);
    }
}

// Floating Patterns
function createFloatingPatterns() {
    const patterns = document.getElementById('floating-patterns');
    const patternCount = 15;
    const patternShapes = ['🌾', '🌿', '🍃', '🌱', '🦋'];
    
    for (let i = 0; i < patternCount; i++) {
        const pattern = document.createElement('div');
        pattern.className = 'floating-pattern';
        pattern.textContent = patternShapes[Math.floor(Math.random() * patternShapes.length)];
        pattern.style.left = Math.random() * 100 + '%';
        pattern.style.fontSize = (Math.random() * 30 + 20) + 'px';
        pattern.style.animationDelay = Math.random() * 20 + 's';
        pattern.style.animationDuration = (Math.random() * 10 + 15) + 's';
        patterns.appendChild(pattern);
    }
}

// Scroll-triggered animations
function setupScrollTriggers() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('[data-scroll-trigger]').forEach(el => {
        observer.observe(el);
    });
}

// Parallax scrolling
function setupParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 - (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Section Management
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    currentSection = sectionId;
    
    // Trigger scroll animations
    setTimeout(() => {
        setupScrollTriggers();
    }, 100);
}

function showLanding() {
    showSection('landing');
    currentUser = null;
    localStorage.removeItem('currentUser');
}

function showFarmerDashboard() {
    showSection('farmer-dashboard');
}

function showCompanyDashboard() {
    showSection('company-dashboard');
}

// Modal Management
function showLoginModal() {
    document.getElementById('loginModal').classList.add('show');
    document.getElementById('loginModal').style.display = 'flex';
}

function showSignupModal() {
    document.getElementById('signupModal').classList.add('show');
    document.getElementById('signupModal').style.display = 'flex';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

// Form Management
function updateLoginForm() {
    const userType = document.getElementById('loginUserType').value;
    const fieldsContainer = document.getElementById('loginFields');
    
    if (userType === 'farmer') {
        fieldsContainer.innerHTML = `
            <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" id="loginPhone" placeholder="+91 XXXXX XXXXX" required>
            </div>
        `;
    } else {
        fieldsContainer.innerHTML = `
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="loginEmail" placeholder="company@email.com" required>
            </div>
        `;
    }
}

function updateSignupForm() {
    const userType = document.getElementById('signupUserType').value;
    const fieldsContainer = document.getElementById('signupFields');
    
    if (userType === 'farmer') {
        fieldsContainer.innerHTML = `
            <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" id="signupPhone" placeholder="+91 XXXXX XXXXX" required>
            </div>
        `;
    } else {
        fieldsContainer.innerHTML = `
            <div class="form-group">
                <label>Company Name</label>
                <input type="text" id="signupCompanyName" placeholder="Your Company Name" required>
            </div>
            <div class="form-group">
                <label>Location</label>
                <input type="text" id="signupLocation" placeholder="City, State" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="signupEmail" placeholder="company@email.com" required>
            </div>
        `;
    }
}

function handleLogin(event) {
    event.preventDefault();
    const userType = document.getElementById('loginUserType').value;
    const password = document.getElementById('loginPassword').value;
    
    let identifier;
    if (userType === 'farmer') {
        identifier = document.getElementById('loginPhone').value;
    } else {
        identifier = document.getElementById('loginEmail').value;
    }
    
    // Simulate login
    currentUser = {
        type: userType,
        identifier: identifier,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    closeModal('loginModal');
    
    if (userType === 'farmer') {
        showFarmerDashboard();
    } else {
        showCompanyDashboard();
    }
    
    showNotification('Login successful!', 'success');
}

function handleSignup(event) {
    event.preventDefault();
    const userType = document.getElementById('signupUserType').value;
    const password = document.getElementById('signupPassword').value;
    
    let userData = { type: userType };
    
    if (userType === 'farmer') {
        userData.phone = document.getElementById('signupPhone').value;
        userData.identifier = userData.phone;
    } else {
        userData.companyName = document.getElementById('signupCompanyName').value;
        userData.location = document.getElementById('signupLocation').value;
        userData.email = document.getElementById('signupEmail').value;
        userData.identifier = userData.email;
    }
    
    currentUser = {
        ...userData,
        signupTime: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    closeModal('signupModal');
    
    if (userType === 'farmer') {
        showFarmerDashboard();
    } else {
        showCompanyDashboard();
    }
    
    showNotification('Account created successfully!', 'success');
}

// Farmer Dashboard Functions
function showFarmerSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    event.target.classList.add('active');
}

// AI Chat Functions
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const response = generateAIResponse(message);
        addChatMessage(response, 'ai');
    }, 1000);
}

function addChatMessage(message, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const avatar = type === 'user' ? '👤' : '🤖';
    const bgClass = type === 'user' ? 'user-message' : 'ai-message';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    chatMessages.push({ message, type, timestamp: new Date().toISOString() });
}

function generateAIResponse(userMessage) {
    const responses = {
        'crop': 'For crop selection, consider your soil type, climate, and water availability. Rabi crops like wheat and barley are planted in winter, while Kharif crops like rice and cotton are planted during monsoon.',
        'soil': 'Different soil types support different crops. Clay soil retains moisture well for rice, sandy soil drains well for root vegetables, and loam soil is ideal for most crops.',
        'water': 'Efficient water management is crucial. Consider drip irrigation for water conservation, and plan crop rotation to optimize water usage.',
        'fertilizer': 'Use organic fertilizers when possible. NPK ratios depend on your crop - leafy greens need more nitrogen, while fruiting plants need more phosphorus and potassium.',
        'season': 'India has three main cropping seasons: Kharif (June-October), Rabi (November-April), and Zaid (April-June). Choose crops based on seasonal weather patterns.',
        'pest': 'Integrated Pest Management (IPM) combines biological, cultural, and chemical methods. Use neem oil as a natural pesticide and encourage beneficial insects.'
    };
    
    const keywords = Object.keys(responses);
    const foundKeyword = keywords.find(keyword => 
        userMessage.toLowerCase().includes(keyword)
    );
    
    if (foundKeyword) {
        return responses[foundKeyword];
    }
    
    return "I'm here to help with farming questions! You can ask me about crops, soil, water management, fertilizers, seasons, or pest control. What would you like to know?";
}

// Land Registration
function submitLandRegistration(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const listing = {
        id: Date.now(),
        photos: [], // In real app, would handle file uploads
        location: formData.get('location') || form.querySelector('input[placeholder*="Village"]').value,
        landSize: formData.get('landSize') || form.querySelector('input[placeholder*="2.5"]').value,
        season: formData.get('season') || form.querySelector('select').value,
        intendedGrowth: formData.get('intendedGrowth') || form.querySelectorAll('select')[1].value,
        soilType: formData.get('soilType') || form.querySelectorAll('select')[2].value,
        waterAvailability: Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value),
        ownerId: currentUser.identifier,
        createdAt: new Date().toISOString(),
        status: 'active'
    };
    
    listings.push(listing);
    localStorage.setItem('listings', JSON.stringify(listings));
    
    form.reset();
    showNotification('Land registered successfully!', 'success');
    loadListings();
}

function loadListings() {
    if (!currentUser || currentUser.type !== 'farmer') return;
    
    const userListings = listings.filter(listing => listing.ownerId === currentUser.identifier);
    const grid = document.getElementById('listingsGrid');
    
    if (userListings.length === 0) {
        grid.innerHTML = `
            <div style="text-align: center; grid-column: 1 / -1; padding: 2rem;">
                <p>No land listings yet. Register your first land to get started!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = userListings.map(listing => `
        <div class="listing-card">
            <div class="listing-image">🌾</div>
            <div class="listing-details">
                <h4>${listing.intendedGrowth} - ${listing.landSize} acres</h4>
                <p><strong>Location:</strong> ${listing.location}</p>
                <p><strong>Season:</strong> ${listing.season}</p>
                <p><strong>Soil Type:</strong> ${listing.soilType}</p>
                <p><strong>Water:</strong> ${listing.waterAvailability.join(', ')}</p>
                <p><strong>Status:</strong> <span style="color: var(--success-color)">Active</span></p>
            </div>
            <div class="listing-actions">
                <button class="vintage-btn small" onclick="editListing(${listing.id})">Edit</button>
                <button class="vintage-btn small" onclick="deleteListing(${listing.id})" style="background: var(--error-color)">Delete</button>
            </div>
        </div>
    `).join('');
}

function editListing(id) {
    showNotification('Edit functionality coming soon!', 'info');
}

function deleteListing(id) {
    if (confirm('Are you sure you want to delete this listing?')) {
        listings = listings.filter(listing => listing.id !== id);
        localStorage.setItem('listings', JSON.stringify(listings));
        loadListings();
        showNotification('Listing deleted successfully!', 'success');
    }
}

// Company Dashboard Functions
function showCompanySection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    event.target.classList.add('active');
}

function toggleCategory(categoryId) {
    const content = document.getElementById(categoryId + '-content');
    const isExpanded = content.classList.contains('expanded');
    
    // Close all categories
    document.querySelectorAll('.category-content').forEach(cat => {
        cat.classList.remove('expanded');
    });
    
    // Open clicked category if it wasn't already open
    if (!isExpanded) {
        content.classList.add('expanded');
    }
}

// Subscription Functions
function subscribeToPlan(planType) {
    const plans = {
        'basic': { name: 'Basic Plan', price: '₹999' },
        'drone': { name: 'Drone Premium', price: '₹5,999' },
        'company': { name: 'Company Premium', price: '₹999/month' },
        'company-premium': { name: 'Company Premium', price: '₹999/month' }
    };
    
    const plan = plans[planType];
    if (plan) {
        showNotification(`Subscribed to ${plan.name} for ${plan.price}!`, 'success');
        
        // In real app, would process payment
        setTimeout(() => {
            showNotification('Payment processed successfully!', 'success');
        }, 2000);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--${type === 'success' ? 'success' : type === 'error' ? 'error' : 'primary'}-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            closeModal(modal.id);
        });
    }
    
    // Enter to send chat message
    if (e.key === 'Enter' && e.target.id === 'chatInput') {
        sendMessage();
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Performance optimization - lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Mobile responsiveness - hamburger menu for mobile
function createMobileMenu() {
    const nav = document.querySelector('.dashboard-nav .nav-menu');
    if (nav && window.innerWidth <= 768) {
        nav.style.display = 'none';
        
        const hamburger = document.createElement('button');
        hamburger.innerHTML = '☰';
        hamburger.className = 'mobile-menu-toggle';
        hamburger.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
        `;
        
        hamburger.addEventListener('click', () => {
            nav.style.display = nav.style.display === 'none' ? 'flex' : 'none';
        });
        
        nav.parentNode.insertBefore(hamburger, nav);
    }
}

// Check for mobile menu on resize
window.addEventListener('resize', () => {
    const existingToggle = document.querySelector('.mobile-menu-toggle');
    if (existingToggle) {
        existingToggle.remove();
    }
    createMobileMenu();
});

// Initialize mobile menu
document.addEventListener('DOMContentLoaded', createMobileMenu);