document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('header nav ul');

    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', () => {
            navUl.classList.toggle('active');
            menuToggle.classList.toggle('active');
            // Cambia l'attributo aria-expanded per l'accessibilità
            const isExpanded = navUl.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('header nav ul li a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Chiudi il menu mobile se è aperto dopo aver cliccato un link
                if (navUl.classList.contains('active')) {
                    navUl.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', false);
                }
                
                // Calcola la posizione dell'elemento target tenendo conto dell'header sticky
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
                
                // Aggiorna la classe active sul link cliccato (opzionale)
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Active link highlighting on scroll (opzionale ma consigliato per UX)
    const sections = document.querySelectorAll('main section[id]');
    function updateActiveNavLink() {
        let currentSectionId = '';
        const headerHeight = document.querySelector('header').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // Aggiungi un piccolo offset
            if (window.pageYOffset >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Esegui al caricamento per la sezione iniziale

    // Contact form submission (AJAX to Formspree)
    const contactForm = document.getElementById('contact-form');
    const formMessages = document.getElementById('form-messages');

    if (contactForm && formMessages) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            formMessages.innerHTML = ''; // Clear previous messages
            formMessages.className = ''; // Clear previous classes

            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    formMessages.innerHTML = 'Grazie! Il tuo messaggio è stato inviato con successo.';
                    formMessages.classList.add('success-message');
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        if (data.hasOwnProperty('errors')) {
                            formMessages.innerHTML = data.errors.map(error => error.message).join(", ");
                        } else {
                            formMessages.innerHTML = 'Oops! C\'è stato un problema durante l\'invio del messaggio. Riprova più tardi.';
                        }
                        formMessages.classList.add('error-message');
                    }).catch(() => {
                        formMessages.innerHTML = 'Oops! C\'è stato un problema e non è stato possibile leggere i dettagli dell\'errore. Riprova più tardi.';
                        formMessages.classList.add('error-message');
                    });
                }
            }).catch(() => {
                formMessages.innerHTML = 'Si è verificato un errore di rete. Controlla la tua connessione e riprova.';
                formMessages.classList.add('error-message');
            });
        });
    }
}); 