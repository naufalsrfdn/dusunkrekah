document.addEventListener('DOMContentLoaded', () => {

    /* --- Navbar Scroll Effect --- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- Hamburger Menu --- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    /* --- Smooth Scrolling --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }

            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* --- Scroll Reveal Animations --- */
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    /* --- Gallery Infinite Loop & Drag --- */
    const galleryScroll = document.getElementById('galleryContainer');
    const galleryTrack = document.getElementById('galleryTrack');

    // Duplicate images for infinite loop
    const children = Array.from(galleryTrack.children);
    children.forEach(child => {
        const clone = child.cloneNode(true);
        galleryTrack.appendChild(clone);
    });

    let scrollPos = 0;
    let autoScrollSpeed = 1;
    let isHovering = false;
    let isDragging = false;
    let startX = 0;

    const animateMarquee = () => {
        if (!isHovering && !isDragging) {
            scrollPos += autoScrollSpeed;

            // If scrolled past the first set of images, reset smoothly
            if (scrollPos >= galleryTrack.scrollWidth / 2) {
                scrollPos = 0;
            }
            galleryScroll.scrollLeft = scrollPos;
        }
        requestAnimationFrame(animateMarquee);
    };

    // Start loop
    requestAnimationFrame(animateMarquee);

    galleryScroll.addEventListener('mouseenter', () => isHovering = true);
    galleryScroll.addEventListener('mouseleave', () => {
        isHovering = false;
        isDragging = false;
    });

    galleryScroll.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - galleryScroll.offsetLeft;
        // Snap the current scroll position so we slide from exactly right here
        scrollPos = galleryScroll.scrollLeft;
    });

    galleryScroll.addEventListener('mouseup', () => {
        isDragging = false;
        scrollPos = galleryScroll.scrollLeft; // Sync internal variable to dragged pos before resuming auto
    });

    galleryScroll.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - galleryScroll.offsetLeft;
        const walk = (startX - x) * 1.5; // Drag sensitivity

        let newScrollPos = scrollPos + walk;

        // Handle wrapping during drag
        if (newScrollPos >= galleryTrack.scrollWidth / 2) {
            newScrollPos = 0;
            startX = e.pageX - galleryScroll.offsetLeft; // reset origin
        } else if (newScrollPos <= 0) {
            newScrollPos = galleryTrack.scrollWidth / 2;
            startX = e.pageX - galleryScroll.offsetLeft; // reset origin
        }

        galleryScroll.scrollLeft = newScrollPos;
        scrollPos = newScrollPos; // keeping synchronized
        startX = x; // Update startX to allow continuous dragging logic smoothly
    });

    /* --- Gallery Lightbox --- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeLightbox = document.getElementById('closeLightbox');

    // Need to select images dynamically since we cloned some
    galleryTrack.addEventListener('click', (e) => {
        if (e.target.classList.contains('gallery-img')) {
            // Jika ada event drag sedang terjadi, batalkan klik
            if (isDragging) return;
            lightboxImg.src = e.target.src;
            lightbox.classList.add('active');
        }
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            lightbox.classList.remove('active');
        }
    });

    /* --- Struktur Organisasi Modal --- */
    const orgModal = document.getElementById('orgModal');
    const closeOrgModal = document.getElementById('closeOrgModal');
    const orgModalTitle = document.getElementById('orgModalTitle');
    const orgModalGallery = document.getElementById('orgModalGallery');
    const clickableNodes = document.querySelectorAll('.clickable-node');

    // Dictionary untuk mock galeri kegiatan masing-masing organisasi
    // Anda bisa menyesuaikan gambar sesuai kebutuhan
    const orgData = {
        "Karang Taruna": ['assets/kartar/keg1.jpeg', 'assets/kartar/keg2.jpeg'],
        "Paguyuban RT": ['assets/tentang.jpg', 'assets/potensi-pertanian.jpg'],
        "Kader Posyandu": ['assets/img/tentang.jpg', 'assets/img/hero-2.jpg'],
        "OSKAR": ['assets/kartar/1-keg1.jpeg', 'assets/kartar/1-keg2.jpeg',
            'assets/kartar/1-keg3.jpeg', 'assets/kartar/1-keg4.jpeg'],
        "MIKAZE": ['assets/kartar/2-keg1.jpeg'],
        "ORENS": ['assets/kartar/3-keg1.jpeg'],
        "RT 1 - RT 3": ['assets/rt/13-keg1.jpeg'],
        "RT 4 - RT 5": ['assets/rt/45-keg1.jpeg'],
        "RT 6 - RT 8": ['assets/rt/68-keg1.jpeg'],
        "Posyandu Balita": ['assets/posyandu/b-keg1.jpeg'],
        "Posyandu Remaja": ['assets/posyandu/r-keg1.jpeg', 'assets/posyandu/r-keg2.jpeg',
            'assets/posyandu/r-keg3.jpeg'],
        "Posyandu Lansia": ['assets/posyandu/l-keg1.jpeg']
    };

    clickableNodes.forEach(node => {
        node.addEventListener('click', () => {
            const orgName = node.getAttribute('data-org');
            orgModalTitle.textContent = `Galeri Kegiatan: ${orgName}`;

            // Clear previous images
            orgModalGallery.innerHTML = '';

            const images = orgData[orgName] || ['assets/hero/1.jpg', 'assets/galeri/1.jpg'];
            images.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = `Kegiatan ${orgName}`;
                orgModalGallery.appendChild(img);
            });

            orgModal.classList.add('active');
        });
    });

    closeOrgModal.addEventListener('click', () => {
        orgModal.classList.remove('active');
    });

    orgModal.addEventListener('click', (e) => {
        // Klik di luar content modal menutup modal
        if (e.target.classList.contains('org-modal')) {
            orgModal.classList.remove('active');
        }
    });

});
