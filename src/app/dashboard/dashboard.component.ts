import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, tap } from 'rxjs/operators';
import { SiteTitleService } from '@red-probeaufgabe/core';
import { FhirSearchFn, IFhirPatient, IFhirPractitioner, IFhirSearchResponse } from '@red-probeaufgabe/types';
import { IUnicornTableColumn } from '@red-probeaufgabe/ui';
import { SearchFacadeService } from '@red-probeaufgabe/search';
import { FilterObject } from './../ui/search-form/search-form.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  // Init unicorn columns to display
  columns: Set<IUnicornTableColumn> = new Set<IUnicornTableColumn>([
    'number',
    'resourceType',
    'name',
    'gender',
    'birthDate',
  ]);
  isLoading = true;

  private _searchFilter: FilterObject = {
    query: '',
    filter: FhirSearchFn.SearchAll
  };

  /*
   * Implement search on keyword or fhirSearchFn change
   **/
  search$: Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>>;
  entries$: Observable<Array<IFhirPatient | IFhirPractitioner>>;
  totalLength$: Observable<number>

  // Inject the concrete serveice instead of the abstract, also added the service to to providers of the dashboard module
  constructor(private siteTitleService: SiteTitleService, private searchFacade: SearchFacadeService) {
    this.siteTitleService.setSiteTitle('Dashboard');
    this._updateDataSource();
  }

  searchFilterChanged(newFilter: FilterObject) {
    this._searchFilter = newFilter;
    this._updateDataSource();
  }

  private _updateDataSource() {
    this.search$ = this.searchFacade
    .search(this._searchFilter.filter, this._searchFilter.query)
    .pipe(
      catchError(this.handleError),
      tap(() => {
        this.isLoading = false;
      }),
      shareReplay(),
    );

    this.entries$ = this.search$.pipe(
      map((data) => !!data && data.entry),
      startWith([]),
    );

    this.totalLength$ = this.search$.pipe(
      map((data) => !!data && data.total),
      startWith(0),
    );
  }

  private handleError(): Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> {
    return of({ entry: [], total: 0 });
  }
}
