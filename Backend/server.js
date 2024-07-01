require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const routes = require('./routes');
const authRoutes = require('./routes/authRoutes');
const chocolateRoutes = require('./routes/chocolateRoutes');
const chocolateFactoryRoutes = require('./routes/chocolateFactoryRoutes');
const app = express();
const port = process.env.PORT || 3000;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/api/chocolates', chocolateRoutes);
app.use('/api/factories', chocolateFactoryRoutes);
app.use('/uploads', express.static(uploadsDir));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
