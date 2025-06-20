import Student from '../models/Student.js';

// Create a new student
export const createStudent = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const student = new Student({ name: name.trim() });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Kick a student by setting isKicked to true
export const kickStudentById = async (req, res) => {
  try {
    const { studentId } = req.body;
    const student = await Student.findByIdAndUpdate(studentId, { isKicked: true }, { new: true });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single student by ID
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Student ID required' });
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Find a student by name and isKicked=false
export const findStudentByName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const student = await Student.findOne({ name: name.trim(), isKicked: false });
    if (!student) {
      return res.status(404).json({ error: 'Student not found or kicked' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 