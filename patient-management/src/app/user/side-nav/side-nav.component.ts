import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  standalone: true, // Mark as standalone component
  imports: [RouterModule], // Import RouterModule here
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
    constructor(private router: Router) {}
  
    logout() {
      localStorage.removeItem('userId');
      this.router.navigate(['/login']);
    }
    
}
