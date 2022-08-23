import { ChangeDetectionStrategy,Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { CourseIconName, CourseLevel, CourseSection, DataService, Question, Response } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';
import { DotNavigatorDot } from 'src/app/UI/components/dot-navigator/dot-navigator.component';
import { PingService } from 'src/app/UI/services/ping.service';
import { MatColor } from 'src/app/UI/services/utilities.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class CourseDetailComponent implements OnInit {

  public index       : number = 0;
  public question    : Question;
  public responses   : Response[];

  public navDots     : DotNavigatorDot[];
  
  public editMode: boolean = true;

  constructor(
    public _data: DataService, 
    public builder: FormBuilder,
    public _ping: PingService,
    public _form: FormService,

    public router: Router,
  ) { }

  ngOnInit(): void {
    if (this._data.courseDetail == undefined){
      this.router.navigate(["cw/courses"]);
    } else {
      this._data.courseDetail.setResponses( this._data.getUserAccount() );
      this._data.courseDetail.questions = this._data.courseDetail.questions.map(q => {
        this.setupResponses(q);
        return q;
      });

      this.setupNavDots( this._data.courseDetail.questions );

      this.updateQuestion()
    }
  }


  updateIndex(int: number | string) {
    let i = this.index;
    switch (int) {
      case "prev":
        i -= 1;
        break;

      case "next":
        i += 1;
        break;

      default:
        i = +int;
        break;
    }

    //  Constrictor
    let max = this._data.courseDetail.questions.length - 1;
    if (i == -1) { i = 0 }
    if (i > max) { i = max }

    if (this.index != i){
      this.index = i;
      this.updateQuestion()
      this.setupNavDots(this._data.courseDetail.questions)
    }
  }
  getCurrentQuestion(): Question{
    let q = this._data.courseDetail.questions.find((_,qi)=> qi == this.index)
    return q;
  }

  updateQuestion(){
    let q = this.getCurrentQuestion()
    this.question  = q;
    this.responses = q.responses;
    this.formValid()
  }


  setupResponses(q: Question){
    let r = q.getUserResponse( this._data.getUserAccount() )
      if (r.formField == undefined) {
          r.formField = this._form.responseFormMap( this._form.initResponseForm().get("text") as FormControl );
      }
  }


  formValid(): boolean{
    return this._data.courseDetail.questions.find(q => q.responses.find(r => r.formField?.control.valid == false) ) == undefined
  }



  setupNavDots(ql: Question[]):void {
    this.navDots = ql.map((q, i) => {

      //  Setup
      let r = q.getResponseFormField()
      let d = new DotNavigatorDot()
        .setIconName("circle")
        .setColor(MatColor.primary)
        .setDisabled( r == undefined )
  
      //  Form Status
      if (r != undefined) {
        if (r.formField.control.valid) {
          d.setIconName("check-circle")
          d.setColor(MatColor.accent)
        } else if (!r.formField.control.valid && !r.formField.control.pristine){
          d.setIconName("alert-octagon") 
          d.setColor(MatColor.warn)
        } 
        if (!r.formField.control.pristine) {
          d.setDisabled(false)
        }
      }

      //  Selected
      if (i == this.index){
        d.setDisabled(false);
      }

      return d;
    });
  }



  finishQuiz(){
    if (!this.formValid()){
      this._ping.send( MatColor.warn, "Form Not Complete" );
    } else {
      this._ping.send( MatColor.primary, "Submitting..." );

      //  Save
      this.submit();

      //  Nav
      this.router.navigate(["cw/courses"]);

      this._ping.send( MatColor.accent, "Saved!" );
    }
  }

  inputEvent(event){
    if (event.type == "blur"){
      this.setupNavDots(this._data.courseDetail.questions);
    }
  }

  submit(){
    this._data.submitQuiz();
  }



  
  public get CourseSection() {
    return CourseSection;
  }

  public get CourseLevel() {
    return CourseLevel;
  }

  public get CourseIconName() {
    return CourseIconName;
  }

}
