import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(
    private _title: Title,
  ) { }


  setTitle(pageTitle) {
    this._title.setTitle(`Payroll${pageTitle ? ' - ' + pageTitle : ''}`);
  }
}
