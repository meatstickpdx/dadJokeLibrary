
const { ObjectId } = require('mongoose').Types;

const byEmoji = (questionId, voterId, emoji) => {
    const steps = [
        matchQuestion(questionId),
        matchVoter(voterId),
        matchEmoji(emoji)
    ];
    return steps;
};

const countByAnswer = (questionId, answerId, emoji) => {
    const steps = [
        matchQuestion(questionId),
        voteCount(answerId, emoji)
    ];
    return steps;
};

const matchQuestion = (id) => {
    return { $match: { question: ObjectId(id) }}; //eslint-disable-line
};

const matchVoter = (id) => {
    return { $match: { voter: ObjectId(id) }}; //eslint-disable-line
};

const matchEmoji = (emoji) => {
    return { $match: { emoji: emoji }}; //eslint-disable-line
};

const voteCount = (answerId, emoji) => {
    return {
        $group: {
            _id: {
                answer: answerId,
                emoji: emoji
            },
            count: { $sum: 1 }
        }
    };
};

module.exports = {
    byEmoji,
    countByAnswer
};