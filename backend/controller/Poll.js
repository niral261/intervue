import Poll from '../models/Poll.js';
import Student from '../models/Student.js';

// Create a new Poll
export const createPoll = async(req,res) => {
    try {
        const pollData = {
            ...req.body,
            startTime: new Date().toISOString()
        };
        const poll = new Poll(pollData);
        await poll.save();
        res.status(201).json(poll);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};


// Get active poll
export const getActivePoll = async(req,res) => {
    try {
        const poll = await Poll.findOne({isActive: true}).sort({createdAt: -1});
        if(!poll) {
            return res.status(404).json({message: 'No active poll found'});
        }
        res.json(poll);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// Submit a vote/answer
export const submitAnswer = async(req,res) => {
    try {
        const {optionIdx} = req.body;
        const poll = await Poll.findById(req.params.id);
        if(!poll) {
            return res.status(404).json({message: 'Poll not found'});
        }
        poll.options[optionIdx].votes = poll.options[optionIdx].votes + 1;
        await poll.save();
        res.json(poll);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};


// Get poll results
export const getPollResults = async(req,res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if(!poll) {
            return res.status(404).json({message: 'Poll not found'});
        }
        res.json(poll.options);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// End a poll 
export const endPoll = async(req,res) => {
    try {
        const poll = await Poll.findByIdAndUpdate(req.params.id, { isActive: false}, { new:true });
        res.json(poll);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// Get all polls history
export const getPollHistory = async(req,res) => {
    try {
        const polls = await Poll.find({}).sort({ createdAt: 1 }).select('question options createdAt');
        console.log(polls);
        res.json(polls);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// Kick out a student
export const kickStudent = async(req,res) => {
    try {
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

