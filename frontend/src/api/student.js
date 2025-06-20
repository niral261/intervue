import { API_URL } from '../api';

export const createStudent = async (name) => {
  const response = await fetch(`${API_URL}/student`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error('Failed to create student');
  }
  return response.json();
};

export const fetchAllStudents = async () => {
  const response = await fetch(`${API_URL}/students`);
  if (!response.ok) {
    throw new Error('Failed to fetch students');
  }
  return response.json();
};

export const kickStudent = async (studentId) => {
  const response = await fetch(`${API_URL}/student/kick`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId }),
  });
  if (!response.ok) {
    throw new Error('Failed to kick student');
  }
  return response.json();
};

export const fetchStudentById = async (studentId) => {
  const response = await fetch(`${API_URL}/student?id=${studentId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch student');
  }
  return response.json();
};

export const findStudentByName = async (name) => {
  const response = await fetch(`${API_URL}/student/find`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    return null;
  }
  return response.json();
}; 