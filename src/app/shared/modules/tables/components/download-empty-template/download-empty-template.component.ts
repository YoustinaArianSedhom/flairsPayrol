import { Component, Input } from '@angular/core';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-download-empty-template',
  templateUrl: './download-empty-template.component.html',
})
export class DownloadEmptyTemplateComponent {
  @Input() public header = 'Upload Files*';
  @Input() public link = '';

  constructor() { }

  
  public openEmptyLink(): void{
    const baseURL = environment.apiUrl.split('/api/')[0] //getting BE Base Absolute URL
    const url = baseURL + this.link
    window.open(url,'_blank')
  }


}
