require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
const authRoutes = require('./routes/authRoutes');
const chocolateRoutes = require('./routes/chocolateRoutes'); // Add this line
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/api/chocolates', chocolateRoutes); // Add this line

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
