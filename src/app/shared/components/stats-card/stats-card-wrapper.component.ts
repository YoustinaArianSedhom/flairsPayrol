import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats-card-wrapper',
  template: `
  <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3 w-2/3 m-auto">
    <ng-content></ng-content>
  </div>`,
  styles: [
  ]
})
export class StatsCardWrapperComponent implements OnInit {

  constructor() { }


  @Input() public gap = 2;
  @Input() public columns = 4;

  ngOnInit(): void {
  }

}
