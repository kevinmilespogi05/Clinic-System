import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-side-nav',
  templateUrl: './user-side-nav.component.html',
  styleUrls: ['./user-side-nav.component.css'],
})
export class UserSideNavComponent {
  constructor(private router: Router) {}

  logout(): void {
    localStorage.clear(); // Clear user session data
    this.router.navigate(['/login']);
  }
}
