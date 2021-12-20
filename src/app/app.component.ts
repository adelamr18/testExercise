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
    this.resetRowsSelection();
    this.selectedRow = selectedObject;
    selectedObject.isRowHighlighted = !selectedObject.isRowHighlighted;
  }

  public arrangeDescendingly = (): void => {
    if (this.objectData.length) {
      if (this.selectedRow.labelId > this.objectData[0].labelId) {
        this.sortObjects(0);
      }
    }
  }

  public arrangeAscendingly = (): void => {
    if (this.objectData.length) {
      if (this.selectedRow.labelId < this.objectData[this.objectData.length -1].labelId) {
        this.sortObjects(this.objectData.length -1);
      }
    }
  }

  private sortObjects = (startIndex: number): void => {
    const selectedIndex = this.objectData.indexOf(this.selectedRow)
    const tempCell = this.objectData[startIndex];
    this.objectData[startIndex] = this.selectedRow;
    this.objectData[selectedIndex] = tempCell; 
  }

  public arrangeOneLevelDesc = (): void => {
    if (this.objectData.length) {
      const selectedIndex = this.objectData.indexOf(this.selectedRow)
      if (this.selectedRow.labelId > this.objectData[selectedIndex -1].labelId) {
        this.sortObjects(selectedIndex - 1);
      }
    }
  }

  public arrangeOneLevelAsc = (): void => {
    if (this.objectData.length) {
      const selectedIndex = this.objectData.indexOf(this.selectedRow)
      if (this.selectedRow.labelId < this.objectData[selectedIndex +1].labelId) {
        this.sortObjects(selectedIndex + 1);
      }
    }
  }

  private resetRowsSelection = (): void => {
    const objectDataCopy = [...this.objectData];
    objectDataCopy.map((obj:ObjectDetails) => obj.isRowHighlighted = false);
  }
  
  
}
