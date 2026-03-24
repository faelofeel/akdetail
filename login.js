const pb = new PocketBase('https://pocketbase-production-70159.up.railway.app');

if (localStorage.getItem('pb_token')) {
  window.location.href = 'admin.html';
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('error');
  const submitBtn = document.getElementById('submitBtn');

  if (!email || !password) {
    errorDiv.textContent = 'Заполните все поля';
    return;
  }

  errorDiv.textContent = '';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Вход...';

  try {
    const authData = await pb.collection('users').authWithPassword(email, password);
    localStorage.setItem('pb_token', authData.token);
    localStorage.setItem('pb_user', JSON.stringify(authData.record));
    window.location.href = 'admin.html';
  } catch (err) {
    errorDiv.textContent = 'Неверный email или пароль';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Войти';
  }
});

document.getElementById('password').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    document.getElementById('loginForm').dispatchEvent(new Event('submit'));
  }
});
