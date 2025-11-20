const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

// Pusher setup
const pusher = new Pusher({
  appId: '2080160',
  key: 'b7d05dcc13df522efbbc',
  secret: '4064ce2fc0ac5596d506',
  cluster: 'us2',
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
