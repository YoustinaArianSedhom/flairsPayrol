import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secretCell'
})
export class SecretCellPipe implements PipeTransform {

  transform(value: unknown): string {
    return '******';
  }

}
