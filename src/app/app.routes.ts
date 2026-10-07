import { Routes } from '@angular/router';
import { bookingGuard } from './guards/booking.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home-page/home-page.component').then((c) => c.HomePageComponent)
    },
    {
        path: 'search',
        loadComponent: () => import('./pages/search-page/search-page.component').then((c) => c.SearchPageComponent)
    },
    {
        path: 'booking',
        canActivate: [bookingGuard],
        loadComponent: () => import('./pages/booking-page/booking-page.component').then((c) => c.BookingPageComponent)
    },
    {
        path: 'confirmation',
        redirectTo: ''
    },
    {
        path: 'confirmation/:id',
        loadComponent: () => import('./pages/confirmation-page/confirmation-page.component').then((c) => c.ConfirmationPageComponent)
    }
];
