import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formateoFechas',
})
export class FormateoFechasPipe implements PipeTransform {
  transform(value: string): string {
    return value.substring(0, 10);
  }
}
