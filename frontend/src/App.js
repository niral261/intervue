import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Container from '@mui/material/Container';
import RoleSelection from "./pages/RoleSelection";
import GetStarted from "./pages/GetStarted";
import SetPoll from "./pages/SetPoll";
import StudentPollWrapper from "./pages/StudentPollWrapper";
import KickedOut from "./pages/KickedOut";
import { socket } from "./socket";

const App = () => {
  return (
    <Router>
      <SocketEventHandler />
      <Container
        maxWidth="lg"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/teacher/set-poll" element={<SetPoll />} />
          <Route
            path="/student/wait-for-question"
            element={<StudentPollWrapper />}
          />
          <Route path="/student-poll" element={<StudentPollWrapper />} />
          <Route path="/kicked-out" element={<KickedOut />} />
        </Routes>
      </Container>
    </Router>
  );
};

const SocketEventHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("studentKicked", () => {
      sessionStorage.clear();
      navigate("/kicked-out");
    });

    return () => {
      socket.off("studentKicked");
    };
  }, [navigate]);

  return null;
};

export default App;
