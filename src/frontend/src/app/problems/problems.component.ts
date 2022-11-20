import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Problem, ProblemsService } from '../services/problems/problems.service';

@Component({
  selector: 'app-problems',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.scss']
})
export class ProblemsComponent implements OnInit {

  problems: Problem[] | undefined;
  constructor(private problemService: ProblemsService, private router: Router) { }

  ngOnInit(): void {
    this.problemService.getProblems().subscribe(
      res => {
        console.log(res);
        this.problems = res;
      }
    )
  }

  viewProblem(id: string) {
    this.router.navigate(['/problems/' + id]);
  }

}
