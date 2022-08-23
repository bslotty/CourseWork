import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountType, Course, CourseIconName, CourseLevel, CoursePhase, CourseSection, DataService } from 'src/app/services/data.service';
import { IconButton } from 'src/app/UI/components/icon/icon.component';

@Component({
  selector: 'app-course-select',
  templateUrl: './course-select.component.html',
  styles: [
  ]
})
export class CourseSelectComponent {

  courseList: Course[];
  sectionList: CourseGroup[] = [];

  constructor( 
    public _data:DataService,
    public router: Router,
    ) { 
      this._data.accountDetail.subscribe(a => {

        if (a.type == AccountType.Mentor){
          this.router.navigate(["cw/grade"]);
        } else {

          this.courseList = this._data.filteredCourseList$.value;
          this.courseList.forEach((c, i) => {
            c.setPhaseFromAccount( a )
            
            let section = this.sectionList.find(g => g.section == c.section )
            if (section == undefined){ 
              this.sectionList.push( new CourseGroup(c.section).addCourse(c) )
            } else {
              section.addCourse(c);
            }

            //  Unlock next section if available
            if (i > 0 && this.courseList[i - 1].phase > 1) {    
              c.nextPhase()
              
            }

            c.setIcon( a ) 
          });

        }
        
        
      });
  }

  listEvent(event){

    switch(event.action){
      case "view":
        this._data.setCourseDetail(event.row);
        this.router.navigate( ["cw/course", event.row.id] );
        break
    }
  }


  viewCourse(course: Course){
    if ( course.phase != CoursePhase.Unavailable ) {
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

class CourseGroup {
  section: CourseSection;
  courses: Course[];
  icon: IconButton;

  constructor(section: CourseSection ){
    this.section = section;
    this.courses = [];
  }

  setCourses(courses: Course[]){
    this.courses = courses;
    this.updateIcon();
    return this;
  }

  addCourse(course: Course ) {
    if (this.courses.find(c => c.id == course.id) == undefined){
      this.courses.push(course);
      this.updateIcon();
    }
    return this;
  }

  updateIcon(){
    let c = this.courses[0]
    if ( c == undefined){
      throw "Course List not setup!"
    } else {
      this.icon = new IconButton( CourseSection[ c.section ] )
        .setIconColor( "primary" )
        .setButtonColor( "transparent" )
        .setIconName( CourseIconName[ CourseSection[ c.section ]] )
    }
    
  }
}

