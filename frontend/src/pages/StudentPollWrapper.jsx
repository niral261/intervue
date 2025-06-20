import React, { useEffect, useState, useRef } from 'react';
import { fetchActivePoll } from '../api/poll';
import {fetchStudentById } from '../api/student';
import { socket } from '../socket';
import WaitForQuestion from './WaitForQuestion';
import StudentPoll from './StudentPoll';
import { useNavigate } from 'react-router-dom';

const StudentPollWrapper = () => {
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [nextPoll, setNextPoll] = useState(null);
  const [isKicked, setIsKicked] = useState(false);
  const showResultsRef = useRef(false);

  const handleResultsShown = () => {
    showResultsRef.current = true;
    if (nextPoll) {
      setPoll(nextPoll);
      setNextPoll(null);
      showResultsRef.current = false;
    }
  };

  useEffect(() => {
    const checkKicked = async () => {
      const studentId = sessionStorage.getItem('studentId');
      if (studentId) {
        try {
          const student = await fetchStudentById(studentId);
          if (student.isKicked) {
            setIsKicked(true);
            navigate('/kicked-out', { replace: true });
            return true;
          }
        } catch {}
      }
      setIsKicked(false);
      return false;
    };

    const fetchPollAndCheck = async () => {
      const kicked = await checkKicked();
      if (kicked) return;
      fetchActivePoll().then((data) => {
        if (data && data.question) {
          setPoll(data);
          navigate('/student-poll', { replace: true });
        } else {
          setPoll(null);
          navigate('/student/wait-for-question', { replace: true });
        }
      });
    };

    fetchPollAndCheck();

    socket.on('pollStarted', (newPoll) => {
      checkKicked().then((kicked) => {
        if (kicked) return;
        if (showResultsRef.current === false && poll) {
          setNextPoll(newPoll);
        } else {
          setPoll(newPoll);
          setNextPoll(null);
          showResultsRef.current = false;
        }
        navigate('/student-poll', { replace: true });
      });
    });

    socket.on('pollEnded', () => {
      setPoll(null);
      setNextPoll(null);
      showResultsRef.current = false;
      navigate('/student/wait-for-question', { replace: true });
    });

    return () => {
      socket.off('pollStarted');
      socket.off('pollEnded');
    };
  }, []);

  if (isKicked) {
    return null;
  }

  if (!poll) return <WaitForQuestion />;

  return <StudentPoll poll={poll} setPoll={setPoll} nextPoll={nextPoll} onResultsShown={handleResultsShown} />;
};

export default StudentPollWrapper;
