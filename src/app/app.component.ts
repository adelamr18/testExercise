import { Component, AfterViewInit } from '@angular/core';
import { objectsData, ICON_CLASS } from 'src/shared/defines/constants';
import { ObjectDetails } from 'src/shared/models/object-details.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  public objectData: ObjectDetails[] = objectsData;
  private selectedRow: any = {};
  public isRowHighlighted = false;
  public modifiedObjectsAFterDrag: ObjectDetails[] = [];

  ngAfterViewInit() {
    this.configureDragAndDropConfiguration();
  }

  public trackById = (index: number, item: ObjectDetails): number => {
    return item.labelId;
  };

  public removeObject = (object: ObjectDetails): void => {
    const index: number = this.objectData.indexOf(object);
    let objectDataCopy = [...this.objectData];
    objectDataCopy.splice(index, 1);
    this.objectData = objectDataCopy;
  };

  public hightlightRow = (selectedObject: ObjectDetails): void => {
    this.resetRowsSelection();
    this.selectedRow = selectedObject;
    selectedObject.isRowHighlighted = !selectedObject.isRowHighlighted;
  };

  public arrangeDescendingly = (): void => {
    if (this.objectData.length) {
      if (this.selectedRow.labelId > this.objectData[0].labelId) {
        this.sortObjects(0);
      }
    }
  };

  public arrangeAscendingly = (): void => {
    if (this.objectData.length) {
      if (
        this.selectedRow.labelId <
        this.objectData[this.objectData.length - 1].labelId
      ) {
        this.sortObjects(this.objectData.length - 1);
      }
    }
  };

  private sortObjects = (startIndex: number): void => {
    const selectedIndex = this.objectData.indexOf(this.selectedRow);
    const tempCell = this.objectData[startIndex];
    this.objectData[startIndex] = this.selectedRow;
    this.objectData[selectedIndex] = tempCell;
  };

  public arrangeOneLevelDesc = (): void => {
    if (this.objectData.length) {
      const selectedIndex = this.objectData.indexOf(this.selectedRow);
      if (
        this.selectedRow.labelId > this.objectData[selectedIndex - 1]?.labelId
      ) {
        this.sortObjects(selectedIndex - 1);
      }
    }
  };

  public arrangeOneLevelAsc = (): void => {
    if (this.objectData.length) {
      const selectedIndex = this.objectData.indexOf(this.selectedRow);
      if (
        this.selectedRow.labelId < this.objectData[selectedIndex + 1]?.labelId
      ) {
        this.sortObjects(selectedIndex + 1);
      }
    }
  };

  private resetRowsSelection = (): void => {
    const objectDataCopy = [...this.objectData];
    objectDataCopy.map((obj: ObjectDetails) => (obj.isRowHighlighted = false));
  };

  private configureDragAndDropConfiguration = (): void => {
    const draggables = document.querySelectorAll('.draggable');
    const containers = document.querySelectorAll('.objects-details-list');

    draggables.forEach((draggable) => {
      draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging');
      });
    });

    draggables.forEach((draggable) => {
      draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging')
        this.modifiedObjectsAFterDrag = [];
        const listElements = this.getListElementsAfterDrag();
        this.formulateObjectsData(listElements);
        this.objectData = JSON.parse(JSON.stringify([...this.modifiedObjectsAFterDrag]));
      });
    });

    containers.forEach((container) => {
      container.addEventListener('dragover', (e: any) => {
        e.preventDefault();
        const afterElement = this.getDragAfterElement(container, e.clientY);
        const draggable: any = document.querySelector('.dragging');
        if (afterElement == null) {
          container.appendChild(draggable);
        } else {
          container.insertBefore(draggable, afterElement)
        }
      });
    });
  };

  private getDragAfterElement = (container: any, y: any): any => {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]
    return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect()
    const offset = y - box.top - box.height / 2
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }
    } else {
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
  };

  private getListElementsAfterDrag = (): string[] => {
    const draggables = document.getElementsByTagName('li');
    let values: string[] = [];
    Array.from(draggables).forEach(function (element) {
      if (element.innerText) {
        values.push(element.innerText);
      }
    });
    return values;
  }

  private formulateObjectsData = (listElements: string[]): void => {
    for (var i = 0; i < listElements.length; i++) {
      let obj = {
        labelName: '',
        labelId: 0,
        isRowHighlighted: false,
        iconClass: ICON_CLASS
      }
      obj.labelName = listElements[i];
      obj.labelId = parseInt(listElements[i + 1]);
      this.modifiedObjectsAFterDrag.push(obj);
      i = i + 1;
    }
  }

  public sortDesc = (): void =>  {
    this.objectData = [...this.objectData].sort(
      (a: ObjectDetails, b: ObjectDetails) => b.labelId - a.labelId
    );
  }

  public sortAsc = (): void =>  {
    this.objectData = [...this.objectData].sort(
      (a: ObjectDetails, b: ObjectDetails) => a.labelId - b.labelId
    );
  }


}
