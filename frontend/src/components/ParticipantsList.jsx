import React from 'react';

const ParticipantsList = ({ participants, isTeacher, onKick }) => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: 16 }}>
        <div style={{ flex: 1, fontWeight: 600 }}>Name</div>
        <div style={{ width: 100, fontWeight: 600 }}>Action</div>
      </div>
      {participants.map((student) => (
        <div key={student._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ flex: 1 }}>{student.name}</div>
          <div style={{ width: 100 }}>
            {isTeacher ? (
              <span
                style={{ color: '#4F0DCE', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => onKick(student)}
              >
                Kick out
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParticipantsList; 