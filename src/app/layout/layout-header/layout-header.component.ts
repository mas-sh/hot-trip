import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'layout-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './layout-header.component.html',
  styleUrl: './layout-header.component.scss'
})
export class LayoutHeaderComponent {
  protected readonly navItems: NavItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Contact us', path: '/contact-us' },
    { label: 'Login', path: '/profile' },
  ];
}
