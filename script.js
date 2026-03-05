document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');


    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
           
            const spans = hamburger.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            const nameInput = document.getElementById('name');
            const phoneInput = document.getElementById('phone');
           
            const name = nameInput.value.trim();
            let phone = phoneInput.value.trim().replace(/\D/g, '');
           
            if (name.length < 3) {
                alert('Имя должно содержать минимум 3 символа');
                nameInput.focus();
                e.preventDefault();
                return false;
            }
           
            if (phone.length < 10) {
                alert('Телефон должен содержать минимум 10 цифр');
                phoneInput.focus();
                e.preventDefault();
                return false;
            }
           
            setTimeout(() => {
                alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
            }, 300);
        });
    }


    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });


    document.querySelectorAll('.card, .service-card, .review-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)';
        observer.observe(card);
    });


    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });


    // Счётчик символов в комментарии
    const commentTextarea = document.getElementById('comment');
    const charCount = document.getElementById('char-count');
    if (commentTextarea && charCount) {
        const updateCount = () => {
            const remaining = 500 - commentTextarea.value.length;
            charCount.textContent = `${remaining} символов осталось`;
        };
        commentTextarea.addEventListener('input', updateCount);
        updateCount();
    }
});