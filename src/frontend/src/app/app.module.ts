import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CodeEditorComponent } from './problem/code-editor/code-editor.component';
import { ProblemComponent } from './problem/problem.component';
import { ProblemDescriptionComponent } from './problem/problem-description/problem-description.component';

@NgModule({
  declarations: [
    AppComponent,
    CodeEditorComponent,
    ProblemComponent,
    ProblemDescriptionComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
