import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProblemsService } from '../services/problems/problems.service';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss'],
})
export class ProblemComponent {
  title: string = '';
  description: string = '';
  id: string = '';

  constructor(private problemService: ProblemsService, private aRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    const id = this.aRoute.snapshot.paramMap.get("id");
    if (id != null) {
      this.problemService.getProblems().subscribe(
        problems => {
          for (var i = 0; i < problems.length; i++) {
            if (problems[i]._id === id) {
              this.title = problems[i].name;
              this.description = problems[i].description;
              this.id = problems[i]._id;
            }
          }
        }
      );
    } else {
      this.router.navigate(["/"]);
    }
  }
}
