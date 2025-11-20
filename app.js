// Pusher Setup
const pusher = new Pusher('YOUR_PUSHER_KEY', {
  cluster: 'YOUR_PUSHER_CLUSTER'
});

const channel = pusher.subscribe('veilian-chat');
channel.bind('new-message', function(data) {
  addMessage(data.displayName, data.message);
});

// DOM elements
const loginBox = document.getElementById('loginBox');
const chatContainer = document.getElementById('chatContainer');
const displayNameInput = document.getElementById('displayName');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const closeChatBtn = document.getElementById('closeChat');
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

let currentUser = '';
let isModerator = false;

// Login
loginBtn.addEventListener('click', () => {
  const name = displayNameInput.value.trim();
  const password = passwordInput.value;

  if(!name) {
    alert("Please enter a display name");
    return;
  }

  currentUser = name;
  if(name === "@ArnekChurchill" && password === "988585aw") {
    isModerator = true;
    alert("Moderator logged in!");
  }

  loginBox.style.display = 'none';
  chatContainer.style.display = 'block';
});

// Open/Close Chat
closeChatBtn.addEventListener('click', () => {
  chatContainer.style.display = 'none';
  loginBox.style.display = 'block';
});

// Send Message
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if(e.key === "Enter") sendMessage();
});

function sendMessage() {
  const msg = messageInput.value.trim();
  if(!msg) return;

  fetch('/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ displayName: currentUser, message: msg })
  });

  messageInput.value = '';
}

// Add Message to ChatBox
function addMessage(name, msg) {
  const msgDiv = document.createElement('div');
  msgDiv.textContent = `${name}: ${msg}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
