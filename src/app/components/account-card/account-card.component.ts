import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Account, AccountColor, AccountType, CourseIconName, CourseSection } from 'src/app/services/data.service';
import { IconButton } from 'src/app/UI/components/icon/icon.component';
import { MatColor } from 'src/app/UI/services/utilities.service';

@Component({
  selector: 'app-account-card',
  templateUrl: './account-card.component.html',
  styles: [
  ]
})
export class AccountCardComponent implements OnInit,OnChanges {

  @Input() account: Account;
  type: string;
  icon: IconButton;


  constructor() { }

  ngOnInit(): void {
    if (this.account != undefined){
      this.type = AccountType[this.account.type];
      this.icon = new IconButton("account")
        .setButtonColor( MatColor[ AccountColor[ AccountType[ this.account.type ]]] )
        .setIconName( CourseIconName[ CourseSection[this.account.section]] )
    }
  }

  ngOnChanges(){
    if (this.account != undefined){
      this.type = AccountType[this.account.type];
      this.icon = new IconButton("account")
        .setButtonColor( MatColor[ AccountColor[ AccountType[ this.account.type ]]] )
        .setIconName( CourseIconName[ CourseSection[this.account.section]] )
    }
  }
}



