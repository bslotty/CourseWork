import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormInputField, FormInputTypes } from '../UI/components/form-field/form-field.component';
import { FormGeneralService } from '../UI/services/form-general.service';
import { Account } from "./data.service"; 

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    public _general: FormGeneralService,
    public builder: FormBuilder,
  ) {   }

  initResponseForm(): FormGroup {
    return this.builder.group({
      text: ["", [Validators.required, Validators.maxLength(1024)]]
    });
  }

  responseFormMap(control: FormControl): FormInputField {
    return new FormInputField()
      .setControl(control)
      .setType(FormInputTypes.blob);
  }


  initAccountSelectForm(): FormGroup {
    return this.builder.group({
      account: ["", [Validators.required, Validators.maxLength(1024)]]
    });
  }

  accountSelectFormMap(control: FormControl, accounts: Account[]): FormInputField {
    return new FormInputField()
      .setControl(control)
      .setType(FormInputTypes.select)
      .setOptions(accounts);
  }
}
