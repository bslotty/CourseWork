import { Component, OnInit } from '@angular/core';
import { Account, DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/UI/services/dialog.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styles: [
  ]
})
export class NavBarComponent implements OnInit {

  account: Account;

  constructor(
    public _data: DataService) { }

  ngOnInit(): void {
    this._data.accountDetail.subscribe(a =>{
      this.account = this._data.getUserAccount();
    });
    
  }

  changeAccount(){
    this._data.openSelectAccountDialog();
  }

}
