import express from 'express';
import fs from 'fs';
import path from 'path';
import { loadStudentsFromFile, saveStudentsToFile } from '../server.js';

// const __dirname = path.dirname(new URL(import.meta.url).pathname);
const router = express.Router();
// const dataPath = path.join(__dirname, '../data', 'students.json');
const dataPath = path.resolve('./data/students.json');

// const rawData = fs.readFileSync(dataPath, 'utf-8');
// const students = JSON.parse(rawData);

// Get all students
router.get('/', (req, res) => {
  res.json(students);
});

// Get a student by ID
router.get('/:id', (req, res) => {
  const studentId = req.params.id;
  const student = students.find(s => s.id === studentId);
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

router.post('/', (req, res) => {
  const { id, name, grades } = req.body;
  if (!id || !name || !grades) {
    return res.status(400).json({ message: 'Missing required student fields' });
  }
  if (students.find(s => s.id === id)) {
    return res.status(409).json({ message: 'Student with this ID already exists' });
  }
    const newStudent = { id, name, grades };
    students.push(newStudent);
    saveStudentsToFile();
    res.status(201).json(newStudent);
});

// PUT /students/:id - Update a student by ID
router.put('/:id', (req, res) => {
  const studentId = req.params.id;
  const updatedStudent = req.body;
  const index = students.findIndex(s => s.id === studentId);
  if (index !== -1) {
    students[index] = updatedStudent;
    saveStudentsToFile();
    res.json(updatedStudent);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

// DELETE /students/:id - Delete a student by ID
router.delete('/:id', (req, res) => {
  const studentId = req.params.id;
  const index = students.findIndex(s => s.id === studentId);
  if (index !== -1) {
    const deletedStudent = students.splice(index, 1);
    saveStudentsToFile();
    res.json(deletedStudent[0]);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

// GET /students/:id/grades - Get all grades for a student
router.get('/:id/grades', (req, res) => {
  const studentId = req.params.id;
  const student = students.find(s => s.id === studentId);
  if (student) {
    res.json(student.grades);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

// GET /students/:id/grades/:subject - Get a specific grade for a student
router.get('/:id/grades/:subject', (req, res) => {
  const studentId = req.params.id;
  const subject = req.params.subject;
  const student = students.find(s => s.id === studentId);
  if (student) {
    const grade = student.grades.find(g => g.subject === subject);
    if (grade) {
      res.json(grade);
    } else {
      res.status(404).json({ message: 'Grade not found for the specified subject' });
    }
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

// GET /students/:id/average - Get average grade for a student
router.get('/:id/average', (req, res) => {
  const studentId = req.params.id;
  const student = students.find(s => s.id === studentId);
  if (student) {
    const total = student.grades.reduce((sum, grade) => sum + grade.score, 0);
    const average = total / student.grades.length;
    res.json({ average });
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

export default router;
