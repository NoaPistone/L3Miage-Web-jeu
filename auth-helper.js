async function submitScore(jeu, score) {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
    await fetch('https://projetswebmiagel3.onrender.com/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ jeu, score })
    });
  } catch (e) {
    console.warn('Score non envoyé :', e);
  }
}