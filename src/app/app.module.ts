import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CourseSelectComponent } from './pages/course-select/course-select.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { UIModule } from './UI/ui.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { QuestionComponent } from './components/question/question.component';
import { CommentComponent } from './components/comment/comment.component';
import { DataService } from './services/data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectAccountComponent } from './dialogs/select-account/select-account.component';
import { AccountCardComponent } from './components/account-card/account-card.component';
import { AccountTypePipe } from './components/account-card/account-type.pipe';
import { GradeComponent } from './pages/grade/grade.component';

@NgModule({
  declarations: [
    AppComponent,
    CourseSelectComponent,
    CourseDetailComponent,
    NavBarComponent,
    NotFoundComponent,
    CommentComponent,
    SelectAccountComponent,
    AccountCardComponent,
    GradeComponent,

    AccountTypePipe,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UIModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
