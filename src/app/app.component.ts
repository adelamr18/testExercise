import { Component, AfterViewInit } from '@angular/core';
import { testData } from 'src/shared/defines/constants';
import { ObjectDetails } from 'src/shared/models/object-details.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  public objectData: ObjectDetails[] = testData;
  private selectedRow: any = {};
  public isRowHighlighted = false;
  public modifiedObjectsAFterDrag: ObjectDetails[] = [];

  ngAfterViewInit() {
  }

  public trackById = (index: number, item: ObjectDetails): number => {
    return item.labelId;
  };

  public removeObject = (object: ObjectDetails): void => {
    const index: number = this.objectData.indexOf(object);
    let objectDataCopy = [...this.objectData];
    objectDataCopy.splice(index, 1);
    this.objectData = objectDataCopy;
  }

  public hightlightRow = (selectedObject: ObjectDetails): void => {
    this.selectedRow = selectedObject;
    selectedObject.isRowHighlighted = !selectedObject.isRowHighlighted;
  }

 

 



}
