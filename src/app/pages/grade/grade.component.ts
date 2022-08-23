import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account, AccountType, Course, CourseLevel, CoursePhase, CourseSection, DataService, GradeList } from 'src/app/services/data.service';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styles: [
  ]
})
export class GradeComponent implements OnInit {

  public gradeList: GradeList[];

  constructor(
    public _data: DataService,
    public router: Router,
  ) {
    this._data.accountDetail.subscribe(a => {
      if (a.type == AccountType.Student) {
        this.router.navigate(["cw/courses"]);
      }
    });




  }

  ngOnInit(): void {
    this.gradeList = this._data.getCoursesToBeGraded();
  }

  viewCourse(course: Course) {
    if (course.phase > 1) {
      this._data.setCourseDetail(course);
      this.router.navigate(["cw/course", course.id]);
    }
  }


  public get CourseSection() {
    return CourseSection;
  }

  public get CourseLevel() {
    return CourseLevel;
  }


}
