import { Component, inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { LayoutWebsiteComponent } from '../../layout/layout-website/layout-website.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightSearch } from '../../data/models/flight-search';

@Component({
  selector: 'home-page',
  imports: [
    LayoutWebsiteComponent,
    FlightSearchComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  private readonly router = inject(Router);

  protected onSearch(search: FlightSearch): void {
    this.router.navigate(['/search'], {
      queryParams: {
        from: search.from,
        to: search.to,
        departureDate: this.toDateParam(search.departureDate),
        // Angular leaves out null params, so one-way searches have no returnDate.
        returnDate: search.returnDate ? this.toDateParam(search.returnDate) : null,
      },
    });
  }

  private toDateParam(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }
}
