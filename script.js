document.addEventListener('DOMContentLoaded', () => {

    // ==================== БУРГЕР-МЕНЮ ====================
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

    // ==================== ПЛАВНЫЙ СКРОЛЛ ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ==================== АНИМАЦИЯ КАРТОЧЕК ПРИ СКРОЛЛЕ ====================
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

    document.querySelectorAll('.card, .service-card, .review-card, .work-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)';
        observer.observe(card);
    });

    // ==================== ЗАКРЫТИЕ МЕНЮ ПО ESC ====================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // ==================== ФОРМА ЗАПИСИ ====================
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        const commentTextarea = document.getElementById('comment');
        const charCount = document.getElementById('char-count');

        // Счётчик символов
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

            const name = document.getElementById('name').value.trim();
            const phoneRaw = document.getElementById('phone').value.trim();
            const car = document.getElementById('car').value.trim();
            const service = document.getElementById('service').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const comment = commentTextarea ? commentTextarea.value.trim() : '';

            if (!name || name.length < 3) return alert('Введите корректное имя (минимум 3 символа)');
            if (!phoneRaw) return alert('Телефон обязателен');
            if (!car) return alert('Укажите марку и модель автомобиля');
            if (!date) return alert('Выберите дату');
            if (!time) return alert('Выберите время');

            const data = {
                name: name,
                phone: phoneRaw,
                car: car,
                service: service,
                date: date,
                time: time,
                comment: comment,
                status: 'новая'
            };

            try {
                const response = await fetch('https://pocketbase-production-70159.up.railway.app/api/collections/bookings/records', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
                    bookingForm.reset();
                    if (charCount) charCount.textContent = '500 символов осталось';
                } else {
                    alert('Ошибка при отправке заявки. Попробуйте ещё раз.');
                }
            } catch (error) {
                console.error(error);
                alert('Ошибка соединения. Проверьте интернет.');
            }
        });
    }

    // ==================== АВТОВЫБОР УСЛУГИ ИЗ URL ====================
    const urlParams = new URLSearchParams(window.location.search);
    const serviceFromUrl = urlParams.get('service');
    if (serviceFromUrl) {
        const select = document.getElementById('service');
        if (select) {
            const cleanService = serviceFromUrl.trim().toLowerCase();
            for (let option of select.options) {
                if (option.text.toLowerCase().includes(cleanService)) {
                    option.selected = true;
                    break;
                }
            }
        }
    }

});
