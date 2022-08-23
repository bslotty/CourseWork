import { Pipe, PipeTransform } from '@angular/core';
import { AccountType } from 'src/app/services/data.service';

@Pipe({
  name: 'AccountType'
})
export class AccountTypePipe implements PipeTransform {

  transform(value: number): unknown {
    return AccountType[value];
  }

}
