const fs = import('fs');
import {generateBro} from './generate.js';
import express from 'express';
import cors from 'cors';
const app = express();
const port = 3000;

app.use(cors());

app.get('/generate', generateBro)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});