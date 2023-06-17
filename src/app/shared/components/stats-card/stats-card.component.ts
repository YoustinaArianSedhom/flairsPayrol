import { Component, Input, OnInit } from '@angular/core';
import { IconConfigModel } from '@shared/models/snippits.model';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss']
})
export class StatsCardComponent implements OnInit {

  constructor() { }

  @Input() public label = 'stats label';
  @Input() public value = 0;
  @Input() public img: string = null;
  @Input() public icon: IconConfigModel = null;

  ngOnInit(): void {
  }

}
