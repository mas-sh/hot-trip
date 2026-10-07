# Hot Trip

Hot Trip is a demo flight booking app built with Angular and Angular Material. A user searches for a flight, filters and sorts the results, picks a flight, fills in their contact details and gets a booking confirmation.

There is no real backend yet. The app talks to API services that return mock data, so the whole flow can be tried without any server.

## The booking flow

1. **Home** (`/`): choose a departure city, a destination and a departure date. Tick *Round trip* to add a return date.
2. **Search results** (`/search?from=AMS&to=LHR&departureDate=2026-10-20`): the search is kept in the URL, so results can be refreshed or shared.
   - Filter by airline (no airline ticked means all airlines) and by departure time.
   - Sort by lowest price, earliest departure or shortest duration.
   - Click *Select* on a flight to book it. Sold-out flights can't be selected.
3. **Booking** (`/booking`): enter full name, email, contact number and the number of passengers. Every field is validated with inline messages. This page is only reachable after selecting a flight; otherwise the user is sent back to the home page.
4. **Confirmation** (`/confirmation/:id`): shows the booking reference, the flight and a summary with the total price. The booking is loaded by its ID, so this page can be refreshed or opened directly. Going to `/confirmation` without an ID sends the user to the home page.

## Demo data and what is mocked

- **Flights** come from `FlightApiService`, which returns the 20 sample flights in `src/app/data/mock/sample-flights.ts`.
- **The search doesn't filter by city on purpose.** Every search returns all sample flights, whatever cities are chosen, so there are always flights to show in the demo. The dates in the search are also ignored. Filtering by airline and departure time on the results page does work.
- **Bookings** go through `BookingApiService`. Creating a booking returns a random 32-character ID and saves the booking in the browser's `localStorage` (`hot-trip.mock-bookings`), standing in for a server. Opening a confirmation URL for an ID that wasn't created in this browser shows example data; the same ID always shows the same booking.
- **Cities** for the search form are listed in `src/app/data/mock/sample-cities.ts`.

When a real API is available, only the method bodies in `src/app/data/api/` need to change to `HttpClient` calls. The rest of the app already works with Observables.

## Requirements

- Node.js 18.19.1 or newer (20.11.1+ or 22+ recommended)
- npm

## Running the project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Then open http://localhost:4200/. The app reloads automatically when you change a source file.

### Other commands

| Command | What it does |
|---|---|
| `npm run build` | Production build into `dist/hot-trip/` |
| `npm run watch` | Development build that rebuilds on every change |
| `npm test` | Runs the unit tests with Karma in Chrome |

To run the tests once in headless Chrome, for example on a CI server:

```bash
npx ng test --watch=false --browsers=ChromeHeadless
```

## Project structure

```
src/app/
├── data/
│   ├── api/        API services (mocked for now): flights and bookings
│   ├── mock/       Sample cities and flights, also used in tests
│   └── models/     TypeScript types: Flight, FlightSearch, Booking, ...
├── guards/         Route guards (bookingGuard protects /booking)
├── layout/         Page layout: header, footer and the website layout with optional banner image
├── pages/          One folder per route; page-specific components live inside their page's folder
│   ├── home-page/          with flight-search (the search form)
│   ├── search-page/        with flight-filters and flight-results
│   ├── booking-page/       with booking-form
│   └── confirmation-page/
├── services/       State shared between components
│   ├── flight-search.service.ts   results, filters and sort for the search page
│   └── booking.service.ts         the flight and details of the booking in progress
└── ui/             Reusable UI components wrapping Angular Material
    ├── ui-button/
    ├── ui-flight/          the flight card
    └── ui-form/            textfield, dropdown, datepicker, checkbox and range slider
```

The `ui-form` components work with Angular forms (`formControlName`, `[formControl]` and `[(ngModel)]`) and show validation messages through their `errorMessage` input.

## Tech stack

- Angular 19 (standalone components, signals, new control flow)
- Angular Material 19 with a custom Material 3 theme (`src/mat-theme.scss`)
- RxJS
- Karma and Jasmine for unit tests
