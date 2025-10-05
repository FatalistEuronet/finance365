class NavigationDropdown {
            constructor() {
                this.containers = document.querySelectorAll('.dropdown-container');
                this.activeDropdown = null;
                this.isAnimating = false;
                
                this.init();
            }

            init() {
                this.bindEvents();
                this.setupAccessibility();
            }

            bindEvents() {
                // Bind events for each dropdown
                this.containers.forEach(container => {
                    const button = container.querySelector('.dropdown-btn');
                    const menu = container.querySelector('.dropdown-menu');
                    const items = container.querySelectorAll('.dropdown-item');

                    // Button click event
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.handleButtonClick(container);
                    });

                    // Button keyboard events
                    button.addEventListener('keydown', (e) => {
                        this.handleButtonKeydown(e, container);
                    });

                    // Menu item events
                    items.forEach((item, index) => {
                        item.addEventListener('click', (e) => {
                            e.preventDefault();
                            this.handleItemClick(item, container);
                        });

                        item.addEventListener('keydown', (e) => {
                            this.handleItemKeydown(e, container, index);
                        });
                    });

                    // Add ripple effect
                    this.setupRippleEffect(button);
                });

                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.dropdown-container')) {
                        this.closeAllDropdowns();
                    }
                });

                // Handle window resize
                window.addEventListener('resize', () => {
                    if (this.activeDropdown) {
                        this.updateMenuPosition(this.activeDropdown);
                    }
                });
            }

            setupAccessibility() {
                this.containers.forEach(container => {
                    const button = container.querySelector('.dropdown-btn');
                    const menu = container.querySelector('.dropdown-menu');
                    const items = container.querySelectorAll('.dropdown-item');

                    button.setAttribute('aria-haspopup', 'true');
                    button.setAttribute('aria-expanded', 'false');
                    menu.setAttribute('role', 'menu');
                    
                    items.forEach((item, index) => {
                        item.setAttribute('role', 'menuitem');
                        item.setAttribute('tabindex', '-1');
                    });
                });
            }

            setupRippleEffect(button) {
                button.addEventListener('click', (e) => {
                    const ripple = document.createElement('span');
                    const rect = button.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.width = ripple.style.height = size + 'px';
                    ripple.style.left = x + 'px';
                    ripple.style.top = y + 'px';
                    ripple.classList.add('ripple');
                    
                    button.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                });
            }

            handleButtonClick(container) {
                if (this.isAnimating) return;

                if (this.activeDropdown === container) {
                    // Close the active dropdown
                    this.closeDropdown(container);
                } else {
                    // Close any open dropdown and open the clicked one
                    this.closeAllDropdowns();
                    this.openDropdown(container);
                }
            }

            handleButtonKeydown(e, container) {
                const items = container.querySelectorAll('.dropdown-item');
                
                switch (e.key) {
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        this.handleButtonClick(container);
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        if (this.activeDropdown !== container) {
                            this.closeAllDropdowns();
                            this.openDropdown(container);
                        }
                        if (items.length > 0) {
                            items[0].focus();
                        }
                        break;
                    case 'Escape':
                        this.closeAllDropdowns();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.focusPreviousButton(container);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.focusNextButton(container);
                        break;
                }
            }

            handleItemKeydown(e, container, currentIndex) {
                const items = container.querySelectorAll('.dropdown-item');
                const button = container.querySelector('.dropdown-btn');
                
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextIndex = (currentIndex + 1) % items.length;
                        items[nextIndex].focus();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
                        items[prevIndex].focus();
                        break;
                    case 'Escape':
                        e.preventDefault();
                        this.closeDropdown(container);
                        button.focus();
                        break;
                    case 'Tab':
                        if (!e.shiftKey && currentIndex === items.length - 1) {
                            this.closeDropdown(container);
                        }
                        break;
                }
            }

            handleItemClick(item, container) {
                const text = item.textContent.trim();
                console.log(`Selected: ${text}`);
                
                // Add visual feedback
                item.style.background = 'rgba(74, 144, 226, 0.2)';
                item.style.transform = 'scale(0.98)';
                
                setTimeout(() => {
                    this.closeDropdown(container);
                    item.style.background = '';
                    item.style.transform = '';
                    
                    // Allow natural navigation to href
                    window.location.href = item.href;
                }, 150);
            }

            openDropdown(container) {
                if (this.isAnimating) return;
                
                this.isAnimating = true;
                this.activeDropdown = container;
                
                container.classList.add('active');
                const button = container.querySelector('.dropdown-btn');
                button.setAttribute('aria-expanded', 'true');
                
                this.updateMenuPosition(container);
                
                // Animate menu items
                const items = container.querySelectorAll('.dropdown-item');
                items.forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-5px)';
                    
                    setTimeout(() => {
                        item.style.transition = 'all 0.3s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 30);
                });
                
                setTimeout(() => {
                    this.isAnimating = false;
                }, 400);
            }

            closeDropdown(container) {
                if (this.isAnimating) return;
                
                this.isAnimating = true;
                
                container.classList.remove('active');
                const button = container.querySelector('.dropdown-btn');
                button.setAttribute('aria-expanded', 'false');
                
                if (this.activeDropdown === container) {
                    this.activeDropdown = null;
                }
                
                // Reset item styles
                const items = container.querySelectorAll('.dropdown-item');
                items.forEach(item => {
                    item.style.transition = '';
                    item.style.opacity = '';
                    item.style.transform = '';
                });
                
                setTimeout(() => {
                    this.isAnimating = false;
                }, 400);
            }

            closeAllDropdowns() {
                this.containers.forEach(container => {
                    if (container.classList.contains('active')) {
                        this.closeDropdown(container);
                    }
                });
            }

            updateMenuPosition(container) {
                const menu = container.querySelector('.dropdown-menu');
                const rect = container.getBoundingClientRect();
                const menuRect = menu.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                
                // Reset position
                menu.style.left = '0';
                
                // Check if menu would go off screen to the right
                if (rect.left + menuRect.width > viewportWidth) {
                    menu.style.left = 'auto';
                    menu.style.right = '0';
                }
            }

            focusNextButton(currentContainer) {
                const containers = Array.from(this.containers);
                const currentIndex = containers.indexOf(currentContainer);
                const nextIndex = (currentIndex + 1) % containers.length;
                const nextButton = containers[nextIndex].querySelector('.dropdown-btn');
                nextButton.focus();
            }

            focusPreviousButton(currentContainer) {
                const containers = Array.from(this.containers);
                const currentIndex = containers.indexOf(currentContainer);
                const prevIndex = currentIndex === 0 ? containers.length - 1 : currentIndex - 1;
                const prevButton = containers[prevIndex].querySelector('.dropdown-btn');
                prevButton.focus();
            }
        }

        // Initialize the navigation dropdown system
        document.addEventListener('DOMContentLoaded', () => {
            const navigation = new NavigationDropdown();
            
            // Optional: Add keyboard shortcut for quick access
            document.addEventListener('keydown', (e) => {
                if (e.altKey && e.key >= '1' && e.key <= '5') {
                    e.preventDefault();
                    const index = parseInt(e.key) - 1;
                    const containers = document.querySelectorAll('.dropdown-container');
                    if (containers[index]) {
                        const button = containers[index].querySelector('.dropdown-btn');
                        button.focus();
                        button.click();
                    }
                }
            });
        });
