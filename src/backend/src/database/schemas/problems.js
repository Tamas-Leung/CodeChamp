import { Schema } from 'mongoose';

const ProblemDifficulty = {
  Easy: 'Easy',
  Medium: 'Medium',
  Hard: 'Hard',
};

const ProblemType = {
  ArrayAndHashing: 'Array and Hashing',
  TwoPointers: 'Two Pointers',
  SlidingWindow: 'Sliding Window',
  Stack: 'Stack',
  BinarySearch: 'Binary Search',
  LinkedList: 'Linked List',
  Trees: 'Tress',
  Tries: 'Tries',
  Heap: 'Heap',
  PriorityQueue: 'Priority Queue',
  Backtracking: 'Back Tracking',
  Graphs: 'Graphs',
  DynamicProgramming: 'Dynamic Programming',
  Greedy: 'Greedy',
  Intervals: 'Intervals',
  MathAndGeometry: 'Math And Geometry',
  BitManipulation: 'Bit Manupulation',
};

const ProblemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  time_limit: {
    type: Number,
    required: true,
  },
  memory_limit: {
    type: Number,
    required: true,
  },
  test_cases: {
    type: [
      {
        input: {
          type: String,
          required: true,
        },
        output: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
  },
  difficulty: {
    type: String,
    enum: Object.values(ProblemDifficulty),
    required: true,
  },
  problem_type: {
    type: [
      {
        type: String,
        enum: Object.values(ProblemType),
      },
    ],
    required: true,
  },
});

export { ProblemSchema, ProblemDifficulty, ProblemType };
