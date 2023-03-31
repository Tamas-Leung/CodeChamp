/*
 * CodeChamp Copyright (C) 2023 Tamas Leung, Anton Kanugalawattage, Zhiming Zhao, Youssef Rizkalla, Dipendra Subedi
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
