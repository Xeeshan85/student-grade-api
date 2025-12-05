import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
  course: { type: String, required: true },
  score: { type: Number, required: true, min: 0, max: 100 },
});

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, match: /^S2025\d{4}$/ },
  // TODO: Add graduation year validation
  name: { type: String, required: true },
  grades: [gradeSchema],
});

const Student = mongoose.model("Student", studentSchema);
export default Student;