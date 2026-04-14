function getToken()  { return localStorage.getItem('token'); }
function getUser()   { return localStorage.getItem('pseudo'); }

function updateLoginIcon() {
  const icon = document.getElementById('login-icon');
  if (!icon) return;
  icon.title = getUser() ? getUser() : 'Se connecter';
}

const authModal  = document.getElementById('auth-modal');
const loginIcon  = document.getElementById('login-icon');
const btnAction  = document.getElementById('btn-action');
const errorMsg   = document.getElementById('auth-error');
const toggleAuth = document.getElementById('toggle-auth');
let isLoginMode  = true;

loginIcon.onclick = () => {
  if (getUser()) {
    if (confirm(`Déconnecter ${getUser()} ?`)) {
      localStorage.removeItem('token');
      localStorage.removeItem('pseudo');
      updateLoginIcon();
    }
  } else {
    authModal.style.display = 'flex';
  }
};

document.getElementById('close-modal').onclick = () => {
  authModal.style.display = 'none';
};

toggleAuth.onclick = () => {
  isLoginMode = !isLoginMode;
  document.getElementById('modal-title').innerText = isLoginMode ? 'Connexion' : 'Inscription';
  btnAction.innerText = isLoginMode ? 'Se connecter' : 'Créer mon compte';
  errorMsg.innerText = '';
};

btnAction.onclick = async () => {
  const pseudo = document.getElementById('username').value.trim();
  const mdp    = document.getElementById('password').value;
  errorMsg.innerText = '';

  const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
  try {
    const res  = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pseudo, mdp })
    });
    const data = await res.json();
    if (!res.ok) { errorMsg.innerText = data.error; return; }

    if (isLoginMode) {
      localStorage.setItem('token',  data.token);
      localStorage.setItem('pseudo', data.pseudo);
      authModal.style.display = 'none';
      updateLoginIcon();
      alert('Bienvenue ' + data.pseudo + ' !');
    } else {
      alert('Compte créé ! Tu peux maintenant te connecter.');
      toggleAuth.onclick();
    }
  } catch {
    errorMsg.innerText = 'Erreur réseau.';
  }
};

updateLoginIcon();