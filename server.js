import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/students.js';
import fs from 'fs';
import path from 'path';


const __dirname = path.dirname(new URL(import.meta.url).pathname);
const dataPath = path.join(__dirname, 'data', 'students.json');

const rawData = fs.readFileSync(dataPath, 'utf-8');
const students = JSON.parse(rawData);

// let students = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Student Grade API\n');
});

app.use('/students', studentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


export function loadStudentsFromFile() {
    if (fs.existsSync(dataPath)) {
        const data = fs.readFileSync(dataPath, 'utf-8');
        try {
            const parsedData = JSON.parse(data);
            students.length = 0; // Clear existing data
            students.push(...parsedData); // Load data from file
            console.log('Students data loaded from file');
        } catch (err) {
            console.error('Error parsing students data from file', err);
        }
    } else {
        console.log('No existing students data file found, starting fresh');
    }
}

// Function to save students data to file
export function saveStudentsToFile() {
    const data = `export const students = ${JSON.stringify(students, null, 2)};\n`;
    fs.writeFileSync(dataPath, data, (err) => {
      if (err) {
        console.error('Error writing to file', err);
      } else {
        console.log('Students data saved to file');
      }
    });
}