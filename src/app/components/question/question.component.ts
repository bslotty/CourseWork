import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { DataService, Question, Response, Comment, CoursePhase, AccountType } from 'src/app/services/data.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionComponent implements OnInit, OnChanges {

  @Input() question: Question;
  QuizPhase    : CoursePhase = CoursePhase.Complete;

  constructor(
    public _data: DataService
  ) { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {  }

}
