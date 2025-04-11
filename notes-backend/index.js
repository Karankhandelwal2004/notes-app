const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const noteRoutes = require('./routes/noteRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); // ✅ Parse incoming JSON

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// ✅ Use dynamic port for deployment
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
