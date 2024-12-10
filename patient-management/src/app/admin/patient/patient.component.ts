import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';  // Import SweetAlert2

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;  // Store the selected user for modal view
  userToDelete: User | null = null;  // Store the user to be deleted
  isEditing: boolean = false;  // Flag for edit mode
  apiUrl: string = 'http://localhost/Clinic-System/clinicapi/api/users/getUsers.php';
  deleteApiUrl: string = 'http://localhost/Clinic-System/clinicapi/api/users/delete.php';
  updateApiUrl: string = 'http://localhost/Clinic-System/clinicapi/api/users/updateUser.php';  // Endpoint for updating user

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        if (response && response.success) {
          // Filter out the user with username 'admin'
          this.users = response.data.filter((user: User) => user.username !== 'admin');
        } else {
          console.error('Failed to fetch users:', response?.message);
        }
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  openModal(user: User): void {
    this.selectedUser = { ...user };  // Copy the user data into selectedUser for viewing/editing
    this.isEditing = false;  // Set initial mode to view
  }

  closeModal(): void {
    this.selectedUser = null;  // Close the modal by setting selectedUser to null
    this.isEditing = false;  // Reset edit mode
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;  // Toggle edit mode
  }

  confirmDelete(user: User): void {
    this.userToDelete = user;  // Set the user to delete

    // Use SweetAlert2 for the delete confirmation modal
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete user ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteUser();
      }
    });
  }

  deleteUser(): void {
    if (!this.userToDelete) return;

    this.http.post<any>(this.deleteApiUrl, { user_id: this.userToDelete.id }).subscribe({
      next: (response) => {
        if (response.success) {
          // Remove the user from the users array
          this.users = this.users.filter(user => user.id !== this.userToDelete!.id);
          Swal.fire('Deleted!', `User ${this.userToDelete?.name} has been deleted.`, 'success');
        } else {
          console.error('Failed to delete user:', response?.message);
        }
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        Swal.fire('Error', 'There was an error deleting the user.', 'error');
      },
    });
  }

  saveUser(): void {
    if (this.selectedUser) {
      this.http.post<any>(this.updateApiUrl, this.selectedUser)
        .subscribe({
          next: (response) => {
            if (response.success) {
              const index = this.users.findIndex(user => user.id === this.selectedUser!.id);
              if (index !== -1) {
                this.users[index] = this.selectedUser!;
              }
              Swal.fire('Saved!', 'User details have been updated.', 'success');
              this.closeModal();
            } else {
              Swal.fire('Error', 'Failed to update user: ' + response?.message, 'error');
            }
          },
          error: (error) => {
            console.error('Error saving user:', error);
            Swal.fire('Error', 'There was an error saving the user: ' + error.message, 'error');
          },
        });
    }
  }
}
