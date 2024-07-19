import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
  standalone: true
})
export class TimePipe implements PipeTransform {

  transform(cookingTimeInMinutes?: number): string { // Make sure cookingTimeInMinutes is a number
    if (cookingTimeInMinutes == undefined)
      return ''
    const hours = Math.floor(cookingTimeInMinutes /60);
    const minutes = cookingTimeInMinutes % 60;

    const hoursStr = hours === 0 ? '' : `${hours} שעות `;
    const minutesStr = minutes === 0 ? '' : `ו-${minutes} דקות`;

    return `${hoursStr}${minutesStr}`;
  }

}
