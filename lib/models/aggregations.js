const { ObjectId } = require('mongoose').Types;

// Generally better to aggregate on answer id, then lookup answer content.
// But, that would require an additional project step :)

const countByAnswer = (questionId) => {
    const steps = [
        lookup(),
        matchQuestion(questionId),
        voteCount(),
        sortCount()
    ];
    return steps;
};

const lookup = () => {
    return {
        $lookup: {
            from: `answers`,
            localField: `answer`,
            foreignField: `_id`,
            as: `answer`
        }
    };
};

const matchQuestion = (id) => {
    return { $match: { question: ObjectId(id) }};
};

const voteCount = () => {
    return {
        $group: {
            _id: {
                answer: '$answer.content',
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
    countByAnswer
};