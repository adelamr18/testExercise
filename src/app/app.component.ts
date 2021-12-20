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
  
  //after trying out drag and drop functionality the other logic wont work because it needs a bit of reworking and because the array 
  //indexes need adjustments so it needs some minor adjustments to work perfectly the only thing that was missing was to set the 
  //modified objects after drag and drop to objectData
  private configureDragAndDropConfiguration = (): void => {
    const draggables = document.querySelectorAll('.draggable');
    const containers = document.querySelectorAll('.objects-details-list');

    draggables.forEach(draggable => {
      draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging');
      })
    });

    draggables.forEach(draggable => {
      draggable.addEventListener('dragend', () => {
        const draggables = document.getElementsByTagName('li') 
        let obj = {
          labelName: '',
          labelId: 0,
          testClass: 'fa-arrows-alt',
          isRowHighlighted: false
        };
        draggable.classList.remove('dragging');
      Array.from(draggables).forEach(function(element, index) {
        obj.labelName = element.innerText;
        obj.labelId = parseInt(element.innerText);
    });      
      })
    });

    containers.forEach(container => {
      container.addEventListener('dragover', (e: any) => {
      e.preventDefault();
      const afterElement = this.getDragAfterElement(container, e.clientY);
      const draggable: any = document.querySelector('.dragging');
      if(afterElement == null){
       container.appendChild(draggable);
      }
      });
    })
  }

  getDragAfterElement = (container: any, y: any): void => {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
    return draggableElements.reduce((closest: any, child: any) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    },
      {
        offset: Number.NEGATIVE_INFINITY
      }).element;
  }



}
