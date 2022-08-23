import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { FormFieldComponent, FormInputField, FormInputTypes } from '../UI/components/form-field/form-field.component';
import { IconButton } from '../UI/components/icon/icon.component';
import { DialogService } from '../UI/services/dialog.service';
import { MatColor } from '../UI/services/utilities.service';


function genID(): string {
  return Math.round(Math.random() * 1000) + ""
}

let _courses   = require("./courses.json")
let _questions = require("./questions.json")
let _comments  = require("./comments.json")
let _responses = require("./responses.json")
let _accounts  = require("./accounts.json")

@Injectable({
  providedIn: 'root'
})
export class DataService {


  //  Lists
  private courseList$: BehaviorSubject<Course[]> = new BehaviorSubject<Course[]>([]);
  public courseList: Observable<Course[]> = this.courseList$.asObservable();

  private accountList$: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  public accountList: Observable<Account[]> = this.accountList$.asObservable();

  //  Detailed
  public courseDetail: Course;
  public accountDetail: BehaviorSubject<Account> = new BehaviorSubject<Account>(undefined);


  public filteredCourseList$: BehaviorSubject<Course[]> = new BehaviorSubject<Course[]>([]);


  constructor(public _dialog: DialogService) {

    //  Init Subs
    this.accountDetail.subscribe(a => {
      let cl = this.courseList$.value
      this.filteredCourseList$.next( cl.filter(c => c.section == a.section) )
    })


    //  Parse Data
    let list = []
    _accounts.forEach(account => list.push(
      new Account(account.id)
        .setName(account.name)
        .setPicture(account.picture)
        .setType( account.type )
        .setSection( account.section ) 
        .setMentor( account.mentor ) )
      );
    this.accountList$.next(list);
    this.setActiveAccount( this.accountList$.value[1] )

    list = [];
    _courses.forEach(course => {
      list.push(new Course(course.id)
        .setSection(course.section)
        .setLevel(course.level)
        .setQuestions(
          _questions.filter(q => q.course_id == course.id).map(q => new Question(q.id, q.course_id).setText(q.text))
        )
        // .setPhase( +CourseLevel[course.level] == CourseLevel.Introductionary ? CoursePhase.Quiz : CoursePhase.Unavailable )
        .setPhase( CoursePhase.Unavailable )
        .setPhaseFromAccount( this.getUserAccount() )
      )
      
    });
    this.courseList$.next(list);
  }


  setCourseDetail(course: Course) {
    this.courseDetail = this.courseList$.value.find(c => c.id == course.id)
  }


  getUserAccount(){
    return this.accountDetail.value;
  }

  getAccountByID(id: number){
    return this.accountList$.value.find(a => a.id == id);
  }

  setActiveAccount( account: Account ){
    this.accountDetail.next( account );
  }

  openSelectAccountDialog(){
    this._dialog.initSettings("Select Account", "Choose an account from the dropdown menu to change to.");
    this._dialog.settings.data.accounts = this.accountList$.value;
    this._dialog.open("SelectAccount");
  }

  setupCourses() {
    let a = this.accountDetail.value;
    switch(a.type){
      case AccountType.Mentor:
        this.accountList$.value
          .filter(acc => acc.mentor == a.id)
          .forEach(acc => acc.courses
            .filter(c => c.phase > 1)
            .forEach(c => a.addCourse(c))
          )
      break;

      case AccountType.Student:
        this.courseList$.value.filter(c => c.section == a.section ).forEach(c => a.addCourse(c));
      break;

    }
  }

  getCoursesToBeGraded(): GradeList[] {

    let list = [];
    let subordinates = this.accountList$.value.filter( act => act.mentor == this.accountDetail.value.id )
    subordinates.forEach(a => {

      let sub_course = this.courseList$.value.filter(c => c.phase > 1 && c.section == a.section )

      if (sub_course.length > 0) {
        sub_course.forEach(c => {
          if (c.questions[0].responses.length > 0 
            && c.questions[0].responses[0].user.id == a.id 
            && list.find(g => g.account.id == a.id) == undefined ){

              c.setIcon(this.accountDetail.value)
              list.push( new GradeList().setAccount(a).setCourses(sub_course) )
          }
        });
      }
    });

    return list;
  }


 
  submitQuiz(){
    this.courseDetail.nextPhase()

     //   Form Value >> Comment >> Reset Form
    this.courseDetail.questions.forEach(q => q.setResponses( q.responses.map(r => {
      if (r.formField != undefined){
        r.comment.setText(r.formField.control.value);
        r.formField = undefined;
        // r.nextPhase();
      }
      return r;
      })));
    
    if (this.accountDetail.value.type == AccountType.Student) {
      this.unlockNextCourse();
    }
  }

  unlockNextCourse(){
    this.courseList$.value
      .find(c => c.section == this.courseDetail.section && c.level == this.courseDetail.level + 1 )
      .nextPhase()
  }


}















export class Account {
  id: number;
  type: AccountType;
  name: string;
  picture: string;
  section: CourseSection;

  mentor: number;

  courses: Course[];

  constructor(id) {
    this.id = id;
    this.courses = [];
  }

  setName(name: string){
    this.name = name;
    return this;
  }

  setPicture(url: string) {
    this.picture = url;
    return this;
  }

  setType(type: string) {
    this.type = AccountType[type];
    return this;
  }

  setSection(section: string) {
    this.section = CourseSection[section];
    return this;
  }

  setMentor(id: number){
    this.mentor = id;
    return this;
  }

  addCourse(course: Course){
    //  Dupe
    // if (this.courses.findIndex(c => c.id == course.id) == -1){ }
    this.courses.push(course);
    return this;
  }
}

export enum AccountType {
  Student, Mentor
}

export enum AccountColor {
  Student = MatColor.accent,
  Mentor = MatColor.warn,
}











export class Course {
  id: number;
  section: CourseSection
  level: CourseLevel;
  phase: CoursePhase;
  actionIcon: IconButton;

  questions: Question[];

  constructor(id) {
    this.id    = id;
  }

  setSection(section: string) {
    this.section = CourseSection[section];
    return this;
  }

  setLevel(level: string) {
    this.level = CourseLevel[level];
    return this;
  }

  setQuestions(questions: Question[]) {
    this.questions = questions;
    return this;
  }

  isComplete(a: Account){
    return this.questions.find( q => q.getUserResponse(a)?.comment == undefined ) == undefined
  }

  setResponses(account: Account) {
    this.questions.forEach(q => {
      if (q.getUserResponse(account) == undefined){
        let r = new Response( genID(), q.id ).setAccount( account ).setComment( new Comment().setId( +genID() ) )
        q.addResponse( r )
      }
      
    })


    return this;
  }

  setPhase(phase: CoursePhase) {
    this.phase = phase;
    return this;
  }

  setPhaseFromAccount(a: Account) {

    let p = 0;
    if ( a.mentor == undefined ){
      p = CoursePhase.Grade;
    } else {
      p = this.level == CourseLevel.Introductionary ? CoursePhase.Quiz : CoursePhase.Unavailable;
      
    }
    // console.log("p:", p);


    if ( this.isComplete(a) ) {
      p += 1;
    } 
    // console.log("p.questions:", quizComplete, p);

    this.setPhase(p);
    return this;
  }






  nextPhase() {
    if (this.phase != CoursePhase.Complete){
      this.phase += 1;
      console.log("Phase Updated:", this.phase, this);
    } else {
      throw "Phase already complete";
    }
  }



  setIcon(account: Account){
    let icon = new IconButton("phase");

    switch(this.phase){
      case CoursePhase.Unavailable:
        icon.setIconName("lock")
        break;

      case CoursePhase.Quiz:
        if( account.type == AccountType.Mentor ){
          icon.setIconName("clock");
        } else {
          icon.setIconName("edit-3").setButtonColor("transparent").setIconColor("primary")
        }
      break;

      case CoursePhase.Grade:
        if( account.type == AccountType.Mentor){
          icon.setIconName("edit-3").setButtonColor("transparent").setIconColor("primary");
        } else {
          icon.setIconName("check-circle").setButtonColor("transparent").setIconColor("accent");
        }
        break;

      case CoursePhase.Complete:
        if( account.type == AccountType.Mentor){
          icon.setIconName("chevron-right").setButtonColor("transparent").setIconColor("primary");
        } else {
          icon.setIconName("award").setButtonColor("transparent").setIconColor("warn");
        }
        break;

    }

    this.actionIcon = icon;
    return this;
  }


}

export enum CoursePhase {
  Unavailable, Quiz, Grade, Complete
}

export enum CourseLevel {
  Introductionary, Foundational, Capstone
}

export enum CourseSection {
  Sales, Engineering, Services, Support, Marketing, Accounting, Legal
}

export enum CourseIconName {
  Sales       = "dollar-sign",
  Engineering = "settings",
  Services    = "tool",
  Support     = "activity",
  Marketing   = "trending-up",
  Accounting  = "credit-card",
  Legal       = "clipboard"
}







export class GradeList {
  account: Account;
  courses: Course[];

  constructor(){ }

  setAccount(account: Account){
    this.account = account;
    return this;
  }

  setCourses(courses: Course[]){
    this.courses = courses;
    return this;
  }
}












export class Question {
  
  id: number;
  course_id: number;
  text: string;

  responses: Response[];

  constructor(id, course_id) {
    this.id        = id;
    this.course_id = course_id;
    this.responses = [];
  }

  setText(text: string) {
    this.text = text;
    return this;
  }

  setResponses(responses: Response[]) {
    this.responses = responses;
    return this;
  }

  addResponse(response: Response){
    this.responses.push( response );
    return this;
  }

  getUserResponse(account: Account): Response {
    return this.responses.find(r => r.user.id == account.id);
  }

  getResponseFormField():Response | undefined {
    return this.responses.find(r => r.formField != undefined)
  }
}












export class Response {
  id         : number;
  question_id: number;
  user       : Account;
  comment    : Comment;
  formField  : FormInputField;

  // phase: CoursePhase;



  constructor(id, question_id) {
    this.id = id;
    this.question_id = question_id;
  }

  setComment(comment: Comment) {
    this.comment = comment;
    return this;
  }

  setAccount(account: Account) {
    this.user = account;
    return this;
  }

  setFormField(field: FormInputField) {
    this.formField = field;
  }

  // setPhase(phase: CoursePhase) {
  //   this.phase = phase;
  //   return this;
  // }


  // nextPhase() {
  //   if (this.phase != CoursePhase.Complete){
  //     this.phase += 1;
  //     console.log("Phase Updated:", this.phase, this);
  //   } else {
  //     throw "Phase already complete";
  //   }
 
  // }


}


















export class Comment {
  id: number;
  text: string;
  rate: number;

  constructor() { }

  setId(id: number) {
    this.id = id;
    return this;
  }

  setText(text: string) {
    this.text = text;
    return this;
  }
  setRate(rate: number){
    this.rate = rate;
    return this;
  }
}

