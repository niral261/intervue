import mongoose from 'mongoose';

const optionSchema = mongoose.Schema({
    text: {
        type: String,
    },
    isCorrect: {
        type: Boolean,
    },
    votes: {
        type: Number,
        default: 0
    }
})

const pollSchema = mongoose.Schema({
    question: {
        type: String,
        required:true
    },
    options: [optionSchema],
    timer: {
        type: Number,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    startTime: {
        type: Date,
        required: true
    }
})

const Poll = mongoose.model('Poll', pollSchema);

export default Poll;