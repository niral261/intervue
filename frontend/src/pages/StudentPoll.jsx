import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Paper, Button, Fab } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useTheme } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { submitAnswer, fetchActivePoll } from "../api/poll";
import Chat from "../components/Chat";

const StudentPoll = ({
  poll,
  questionNumber = 1,
  setPoll,
  nextPoll,
  onResultsShown,
}) => {
  const theme = useTheme();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const user = sessionStorage.getItem('role') || 'Student';

  const startRef = useRef(null);
  const timerRef = useRef();

  if (poll && !startRef.current) {
    startRef.current = poll.startTime
      ? new Date(poll.startTime).getTime()
      : (() => {
          const key = `poll-start-${poll._id ?? "unknown"}`;
          const saved = Number(sessionStorage.getItem(key));
          if(saved) 
            return saved;
          const now = Date.now();
          sessionStorage.setItem(key, String(now));
          return now;
        })();
  }
  const secondsLeft = () => {
    if (!poll) 
        return 0;
    const duration = poll.timer ?? 60;
    const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
    return Math.max(0, duration - elapsed);
  };

  const [timeLeft, setTimeLeft] = useState(secondsLeft);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!poll) return;

    startRef.current = Date.now();
    setShowResults(false);
    setSelectedOption(null);
    setIsSubmitting(false);
    setTimeLeft(60); 
    if(timerRef.current)
        clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [poll?._id]);

  useEffect(() => {
    if (showResults && onResultsShown) {
      onResultsShown();
    }
    // eslint-disable-next-line
  }, [showResults]);

  const postAnswer = async () => {
    if (selectedOption == null || isSubmitting) return;

    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      await submitAnswer(poll._id, selectedOption);
      const updatedPoll = await fetchActivePoll();
      if (updatedPoll && updatedPoll._id === poll._id) {
        setPoll(updatedPoll);
      }
    } catch (e) {}
    setShowResults(true);
  };

  const handleSubmit = () => {
    postAnswer();
  };

  useEffect(() => {
    if (timeLeft === 0 && !showResults) {
      postAnswer();
    }
    // eslint-disable-next-line
  }, [timeLeft]);

  if (!poll) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography fontWeight={600} fontSize={20} align="center">
          Wait for the teacher to ask a new question...
        </Typography>
      </Box>
    );
  }

  const totalVotes = poll.options.reduce(
    (sum, opt) => sum + (opt.votes || 0),
    0
  );

  const handleSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ background: theme.palette.background.default }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 3,
          p: 0,
          overflow: "hidden",
        }}
      >
        <Box display="flex" alignItems="left" p={2} pb={0}>
          <Typography
            fontWeight={700}
            fontFamily="Sora"
            flex={1}
            fontSize={18}
            color={theme.palette.text.primary}
          >
            {`Question ${questionNumber}`}
          </Typography>
          <AccessTimeIcon
            sx={{ color: theme.palette.text.primary, fontSize: 20 }}
          />
          <Typography
            fontWeight={600}
            fontFamily="Sora"
            color="error"
            fontSize={16}
            ml={0.5}
          >
            {timeLeft}
          </Typography>
        </Box>

        <Box
          sx={{
            color: "#fff",
            borderRadius: "12px 12px 0 0",
            p: 2,
            mt: 2,
            mb: 1,
            background: "linear-gradient(90deg, #343434 0%, #6E6E6E 100%)",
          }}
        >
          <Typography fontWeight={600} fontSize={16}>
            {poll.question}
          </Typography>
        </Box>

        <Box px={2} pb={2}>
          {poll.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const percent =
              totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
            return (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 2,
                  border: isSelected
                    ? `2px solid ${theme.palette.primary.main}`
                    : "2px solid transparent",
                  bgcolor: isSelected
                    ? theme.palette.background.default
                    : "#F5F5F5",
                  mb: 1.5,
                  px: 2,
                  py: 1.2,
                  position: "relative",
                  overflow: "hidden",
                  cursor: showResults ? "default" : "pointer",
                  transition: "border 0.2s, background 0.2s",
                  ...(showResults
                    ? {}
                    : {
                        cursor: "pointer",
                        "&:hover": {
                          border: isSelected
                            ? `2px solid ${theme.palette.primary.main}`
                            : '2px solid #6E6E6E',
                          background: isSelected
                            ? theme.palette.background.default
                            : "#ececec",
                        },
                        "&:focus": {
                          boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
                        },
                      }),
                }}
                onClick={() => !showResults && handleSelect(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  !showResults &&
                  (e.key === "Enter" || e.key === " ") &&
                  handleSelect(idx)
                }
              >
                {showResults && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: `${percent}%`,
                      bgcolor: theme.palette.primary.main,
                      opacity: 0.7,
                      borderRadius: 2,
                      zIndex: 0,
                      transition: "width 0.5s",
                    }}
                  />
                )}
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    bgcolor: isSelected
                      ? theme.palette.primary.main
                      : theme.palette.secondary.light,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontFamily: "Sora",
                    mr: 2,
                    zIndex: 1,
                  }}
                >
                  {idx + 1}
                </Box>
                <Typography
                  fontFamily="Sora"
                  color={theme.palette.text.primary}
                  fontWeight={isSelected ? 600 : 400}
                  fontSize={15}
                  sx={{ zIndex: 1 }}
                >
                  {opt.text}
                </Typography>

                {showResults && (
                  <Typography
                    sx={{
                      ml: "auto",
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      zIndex: 1,
                    }}
                  >
                    {percent}%
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      </Paper>

      <Box
        width="100%"
        maxWidth={500}
        display="flex"
        justifyContent="flex-end"
        mt={3}
      >
        {!showResults && timeLeft > 0 ? (
          <Button
            variant="contained"
            disabled={selectedOption == null || isSubmitting}
            onClick={handleSubmit}
            sx={{
              borderRadius: 4,
              px: 6,
              py: 1.5,
              fontFamily: "Sora",
              fontWeight: 600,
              fontSize: 18,
              backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              backgroundColor: "unset",
              boxShadow: "none",
              textTransform: "none",
            }}
          >
            Submit
          </Button>
        ) : (
          <Typography
            fontWeight={600}
            fontSize={20}
            align="center"
            width="100%"
            mt={2}
            sx={{ color: theme.palette.text.primary }}
          >
            Wait for the teacher to ask a new question..
          </Typography>
        )}
      </Box>

      <Box position="fixed" bottom={32} right={32}>
        <Fab
          color="primary"
          onClick={() => setIsChatOpen(prev => !prev)}
          sx={{
            background: "#5767D0",
            "&:hover": { background: "#4F0DCE" },
          }}
        >
          <ChatIcon />
        </Fab>
      </Box>

      {isChatOpen && (
        <Chat 
          user={user} 
          onClose={() => setIsChatOpen(false)} 
        />
      )}
    </Box>
  );
};

export default StudentPoll;
