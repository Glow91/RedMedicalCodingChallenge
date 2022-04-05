import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FhirSearchFn } from '@red-probeaufgabe/types';

export interface FilterObject {
  query: string;
  filter: FhirSearchFn;
}

@Component({
  selector: 'app-search',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {

  @Output()
  filterChanged = new EventEmitter<FilterObject>();

  public searchForm: FormControl;
  public roleForm = new FormControl();
  public roleList = [
    { value: FhirSearchFn.SearchAll, label: 'Patients + Practitioners (Patient/Ärzte)'},
    { value: FhirSearchFn.SearchPatients, label: 'Patients (Patient)'},
    { value: FhirSearchFn.SearchPractitioners, label: 'Practitioners (Ärzte)'},
  ];
  
  private _filterObj: FilterObject = {
    query: '',
    filter: FhirSearchFn.SearchAll,
  }

  ngOnInit(): void {
    this.searchForm = new FormControl('', [
      Validators.pattern(/[a-z0-9]/i),
      this._noUmlautValidator,
    ])
    this.roleForm.setValue(FhirSearchFn.SearchAll);
  }

  searchChanged() {
    if(this.searchForm.valid) {
      this._filterObj.query = this.searchForm.value;
      this.filterChanged.emit(this._filterObj);
    }
  }

  roleChanged(newFilter: FhirSearchFn) {
    this._filterObj.filter = newFilter;
    this.filterChanged.emit(this._filterObj);
  }

  private _noUmlautValidator(control: FormControl) {
    const regEx = new RegExp(/[\u00e4\u00f6\u00fc]/i);
    const hasUmlaut = regEx.test(control.value || '');
    return !hasUmlaut ? null : {'umlaut': true};
  }
}
