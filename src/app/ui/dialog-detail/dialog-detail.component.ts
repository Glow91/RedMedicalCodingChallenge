import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FhirUtilService } from '@red-probeaufgabe/search';
import { IFhirPatient, IFhirPractitioner, IPreparedIFhirPatient, IPreparedIFhirPractitioner } from '@red-probeaufgabe/types';

@Component({
  selector: 'app-dialog-detail',
  templateUrl: './dialog-detail.component.html',
  styleUrls: ['./dialog-detail.component.scss'],
})
export class DialogDetailComponent {
  public isPatient: boolean; 
  public data: IPreparedIFhirPatient | IPreparedIFhirPractitioner

  constructor(
    public dialogRef: MatDialogRef<DialogDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private _dataSource: IFhirPatient | IFhirPractitioner,
    private _utils: FhirUtilService) {
    this.isPatient = this._dataSource.resourceType === 'Patient';
    this.data = this._utils.prepareData(this._dataSource);
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
