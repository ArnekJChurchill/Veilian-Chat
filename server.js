const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcrypt');
const Pusher = require('pusher');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// === Pusher Setup ===
const pusher = new Pusher({
  appId: '2080160',
  key: 'b7d05dcc13df522efbbc',
  secret: '4064ce2fc0ac5596d506',
  cluster: 'us2',
  useTLS: true
});

// === Load accounts and banned IPs ===
const accountsFile = './accounts.json';
const bannedFile = './banned.json';

let accounts = fs.existsSync(accountsFile) ? JSON.parse(fs.readFileSync(accountsFile)) : {};
let bannedIPs = fs.existsSync(bannedFile) ? JSON.parse(fs.readFileSync(bannedFile)) : [];

// === Account Routes ===
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip;

  if (bannedIPs.includes(ip)) return res.status(403).send('Your IP is banned.');

  let newUsername = username;
  let count = 1;
  while (accounts[newUsername]) {
    count++;
    newUsername = `${username}${count}`;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  accounts[newUsername] = { password: hashedPassword, ip };
  fs.writeFileSync(accountsFile, JSON.stringify(accounts, null, 2));
  res.json({ success: true, username: newUsername });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip;

  if (bannedIPs.includes(ip)) return res.status(403).send('Your IP is banned.');

  const account = accounts[username];
  if (!account) return res.status(400).send('Invalid username or password.');

  const valid = await bcrypt.compare(password, account.password);
  if (!valid) return res.status(400).send('Invalid username or password.');

  res.json({ success: true });
});

// === Moderator: Ban IP ===
app.post('/ban', (req, res) => {
  const { username } = req.body;
  if (!accounts[username]) return res.status(400).send('User not found.');

  const ip = accounts[username].ip;
  if (!bannedIPs.includes(ip)) {
    bannedIPs.push(ip);
    fs.writeFileSync(bannedFile, JSON.stringify(bannedIPs, null, 2));
  }
  res.json({ success: true });
});

// === Chat Route ===
app.post('/message', (req, res) => {
  const { displayName, message } = req.body;
  const ip = req.ip;

  if (bannedIPs.includes(ip)) return res.status(403).send('You are banned.');

  pusher.trigger('Veilian-CHAT-Z8', 'new-message', { displayName, message });
  res.send('ok');
});

app.listen(PORT, () => console.log(`Veilian-Chat running on port ${PORT}`));
