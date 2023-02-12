import { Problems } from '../../database/mongoose.js';

export const getRandomProblemId = async (problemsPlayed) => {
    const problems = await Problems.where('_id').nin(problemsPlayed).exec();
    const index = Math.floor(Math.random() * problems.length);
    return problems[index]._id;
};

export default {};
