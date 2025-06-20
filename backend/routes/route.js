import express from 'express';
import {createPoll, getActivePoll, submitAnswer, getPollResults, endPoll, getPollHistory, kickStudent} from '../controller/Poll.js';
import { createStudent, getAllStudents, kickStudentById, getStudentById, findStudentByName } from '../controller/Student.js';

const router = express.Router();

router.post('/', createPoll);
router.get('/active', getActivePoll);
router.post('/:id/answer', submitAnswer);
router.get('/:id/results', getPollResults);
router.get('/:id/end', endPoll);
router.get('/history', getPollHistory);
router.post('/kick-student', kickStudent);
router.post('/student', createStudent);
router.get('/students', getAllStudents);
router.post('/student/kick', kickStudentById);
router.get('/student', getStudentById);
router.post('/student/find', findStudentByName);

export default router;