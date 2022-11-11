import { Component } from '@angular/core';

@Component({
  selector: 'app-problem-description',
  templateUrl: './problem-description.component.html',
  styleUrls: ['./problem-description.component.scss'],
})
export class ProblemDescriptionComponent {
  title = 'Two Sum';
  description = [
    `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.`,
    `You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    `You can return the answer in any order.`,
  ];
}
