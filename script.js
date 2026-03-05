document.addEventListener('DOMContentLoaded', () => {
    // Бургер-меню
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

    // Плавный скролл по якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Анимация карточек при скролле
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

    // Закрытие меню по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Обработка формы записи (только на странице booking.html)
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        // Счётчик символов для комментария
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

        // Отправка формы
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Твоя старая валидация
            const nameInput = document.getElementById('name');
            const phoneInput = document.getElementById('phone');
            
            const name = nameInput.value.trim();
            let phone = phoneInput.value.trim().replace(/\D/g, '');
            
            if (name.length < 3) {
                alert('Имя должно содержать минимум 3 символа');
                nameInput.focus();
                return;
            }
            
            if (phone.length < 10) {
                alert('Телефон должен содержать минимум 10 цифр');
                phoneInput.focus();
                return;
            }

            // Данные для PocketBase
            const data = {
                name:    name,
                phone:   phoneInput.value.trim(),  // сохраняем оригинальный формат телефона
                car:     document.getElementById('car').value.trim(),
                service: document.getElementById('service').value,
                date:    document.getElementById('date').value,
                time:    document.getElementById('time').value,
                comment: document.getElementById('comment')?.value.trim() || '',
                status:  'новая'
            };

            const PB_URL = 'https://pocketbase-production-70159.up.railway.app';

            try {
                const response = await fetch(`${PB_URL}/api/collections/bookings/records`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
                    bookingForm.reset();
                    // сбрасываем счётчик
                    if (charCount) charCount.textContent = '500 символов осталось';
                } else {
                    const err = await response.json();
                    alert('Ошибка отправки: ' + (err.message || 'Попробуйте позже'));
                }
            } catch (error) {
                alert('Ошибка соединения. Попробуйте позже или позвоните нам.');
                console.error(error);
            }
        });
    }
});
