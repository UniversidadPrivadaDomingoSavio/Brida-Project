// Archivo: assets/js/components/header.js

export function initHeader() {
    const header = document.getElementById('main-header');
    const menuToggle = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('close-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const allMobileItems = document.querySelectorAll('.menu-movil-item');

    if (!header || !menuToggle || !mobileNav) return; 

    // 1. SCROLL DEL HEADER
    let ticking = false;
    function updateHeaderScroll() {
        header.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { window.requestAnimationFrame(updateHeaderScroll); ticking = true; }
    });
    updateHeaderScroll();

    // 2. MÓDULO MÓVIL
    function toggleMenu() {
        const isClosing = mobileNav.classList.contains('is-active');
        mobileNav.classList.toggle('is-active');
        const isOpen = mobileNav.classList.contains('is-active');
        menuToggle.setAttribute('aria-expanded', isOpen);

        header.classList.toggle('menu-open', isOpen);

        if (isOpen) {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            setTimeout(() => closeBtn.focus(), 100);
        } else {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            if (isClosing) { 
                allMobileItems.forEach(item => {
                    item.classList.remove('is-active');
                    const submenu = item.querySelector('.menu-movil-sublista');
                    if (submenu) submenu.style.maxHeight = null;
                });
            }
            menuToggle.focus();
        }
    }
    
    menuToggle.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);

    const dropdownItems = Array.from(allMobileItems).filter(item => item.querySelector('.menu-movil-sublista'));
    dropdownItems.forEach(item => {
        const link = item.querySelector('.dropdown-trigger');
        const submenu = item.querySelector('.menu-movil-sublista');

        link.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            if (item.classList.contains('is-active')) {
                item.classList.remove('is-active');
                submenu.style.maxHeight = null;
            } else {
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('is-active')) {
                        otherItem.classList.remove('is-active');
                        otherItem.querySelector('.menu-movil-sublista').style.maxHeight = null;
                    }
                });
                item.classList.add('is-active');
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
            }
        });
    });

    document.querySelectorAll('.menu-movil-enlace').forEach(link => {
        const parent = link.parentElement;
        if (!parent.querySelector('.menu-movil-sublista')) {
            link.addEventListener('click', () => { if (mobileNav.classList.contains('is-active')) toggleMenu(); });
        }
    });

    mobileNav.addEventListener('click', (e) => { if (e.target === mobileNav) toggleMenu(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && mobileNav.classList.contains('is-active')) toggleMenu(); });

    // 3. EFECTO DIMMING MEGA MENÚ
    const megaMenu = document.querySelector('.submenu-desplegable-caja');
    const columns = document.querySelectorAll('.submenu-columna');

    if (megaMenu && columns.length > 0) {
        columns.forEach(col => {
            col.addEventListener('mouseenter', () => {
                megaMenu.classList.add('has-dimming');
                col.classList.add('is-focused');
            });
            col.addEventListener('mouseleave', () => {
                megaMenu.classList.remove('has-dimming');
                col.classList.remove('is-focused');
            });
        });
    }
}