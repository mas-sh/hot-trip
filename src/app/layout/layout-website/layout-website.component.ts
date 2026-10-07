import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { LayoutHeaderComponent } from '../layout-header/layout-header.component';
import { LayoutFooterComponent } from '../layout-footer/layout-footer.component';

@Component({
  selector: 'layout-website',
  imports: [
    LayoutHeaderComponent,
    LayoutFooterComponent,
    NgOptimizedImage,
  ],
  templateUrl: './layout-website.component.html',
  styleUrl: './layout-website.component.scss'
})
export class LayoutWebsiteComponent {
  /** Full-width image shown right under the header. */
  bannerImage = input<string>();
}
