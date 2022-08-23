import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment, Course, CoursePhase, Response } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';
import { FormInputField, FormInputTypes } from 'src/app/UI/components/form-field/form-field.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class CommentComponent implements OnInit, OnChanges {

  @Input() comment: Comment;
  @Input() label: string;
  @Input() locked: boolean = false;

  form: FormGroup;
  fields: FormInputField[] = []


  constructor(
    public builder: FormBuilder,
    public _form: FormService,
  ) {
    this.form = this._form.initResponseForm();
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    this.fields = [ new FormInputField()
      .setControl(this.form.get("text"))
      .setType(FormInputTypes.blob)
      .setLabel(this.comment.id+"") ];

    if (this.comment != undefined){
      this.form.get("text").setValue(this.comment.text);
    }
    
  }

}
