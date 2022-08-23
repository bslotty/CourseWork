import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import { CourseSelectComponent } from './pages/course-select/course-select.component';
import { GradeComponent } from './pages/grade/grade.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: "cw/courses",
    component: CourseSelectComponent,
  },

  {
    path: "cw/course/:id",
    component: CourseDetailComponent,
  },


  {
    path: "cw/grade",
    component: GradeComponent,
  },

  {
    path: "cw/grade/:id",
    component: CourseDetailComponent,
  },

  {
    path: "cw",
    redirectTo: "cw/courses",
    pathMatch: "full"
  },


  {
    path: "**",
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
