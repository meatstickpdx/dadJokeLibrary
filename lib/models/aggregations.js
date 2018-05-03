
const { ObjectId } = require('mongoose').Types;

const byEmoji = (questionId, voterId, emoji) => {
    const steps = [
        matchQuestion(questionId),
        matchVoter(voterId),
        matchEmoji(emoji)
    ];
    return steps;
};

const countByAnswer = (questionId) => {
    const steps = [
        matchQuestion(questionId),
        voteCount(),
        sortCount()
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

const voteCount = () => {
    return {
        $group: {
            _id: {
                answer: '$answer',
                emoji: '$emoji'
            },
            count: { $sum: 1 }
        }
    };
};

const sortCount = () => {
    return {
        $sort: { 'count': -1 }
    };
};

module.exports = {
    byEmoji,
    countByAnswer
};