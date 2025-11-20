document.addEventListener('DOMContentLoaded', () => {
  const authWrapper = document.getElementById('authWrapper');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const registerBtn = document.getElementById('registerBtn');
  const loginBtn = document.getElementById('loginBtn');
  const authMsg = document.getElementById('authMsg');

  const chatBox = document.getElementById('chatBox');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');

  let loggedIn = false;

  // Pusher
  Pusher.logToConsole = true;
  const pusher = new Pusher('b7d05dcc13df522efbbc', { cluster: 'us2' });
  const channel = pusher.subscribe('Veilian-CHAT-Z8');
  channel.bind('new-message', data => {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = `${data.displayName}: ${data.message}`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  // Register
  registerBtn.addEventListener('click', () => {
    fetch('/register', {
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({username: usernameInput.value, password: passwordInput.value})
    }).then(res => res.json())
      .then(data => {
        if(data.success){
          authMsg.textContent = `Registered as ${data.username}`;
        } else authMsg.textContent = 'Registration failed';
      });
  });

  // Login
  loginBtn.addEventListener('click', () => {
    fetch('/login', {
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({username: usernameInput.value, password: passwordInput.value})
    }).then(res => {
      if(res.ok){
        loggedIn = true;
        authWrapper.style.display = 'none';
        chatBox.style.display = 'flex';
      } else {
        authMsg.textContent = 'Login failed';
      }
    });
  });

  // Send message
  sendBtn.addEventListener('click', () => {
    if(!loggedIn) return;
    const message = chatInput.value.trim();
    if(!message) return;
    fetch('/message', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({displayName: usernameInput.value, message})
    }).then(res=>{
      if(res.ok) chatInput.value='';
    });
  });

  chatInput.addEventListener('keydown', e => { if(e.key==='Enter') sendBtn.click(); });
});
