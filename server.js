const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

// Pusher setup
const pusher = new Pusher({
  appId: 'YOUR_APP_ID',
  key: 'YOUR_PUSHER_KEY',
  secret: 'YOUR_PUSHER_SECRET',
  cluster: 'YOUR_PUSHER_CLUSTER',
  useTLS: true
});

// Send message endpoint
app.post('/send', (req, res) => {
  const { displayName, message } = req.body;

  pusher.trigger('veilian-chat', 'new-message', {
    displayName, message
  });

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Veilian-Chat server running at http://localhost:${PORT}`);
});

