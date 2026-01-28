const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const staticDir = path.join(__dirname, 'out');

app.use(express.static(staticDir));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
