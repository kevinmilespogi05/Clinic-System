import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css'],
  providers: [PatientService],
})
export class InsuranceComponent implements OnInit {
  claims: any[] = [];
  appointments: any[] = [];
  claimForm: FormGroup;
  currentServiceType: string = '';
  discount: number = 0;

  constructor(private patientService: PatientService, private fb: FormBuilder) {
    this.claimForm = this.fb.group({
      appointment_id: [''],
      service_type: [{ value: '', disabled: true }],  // Disabled at initialization
      claim_description: [''],
      discount: [{ value: 0, disabled: true }],  // Disabled at initialization
    });       
  }

  ngOnInit(): void {
    this.loadClaims();     
    this.loadAppointments(); 
  }
  
  loadAppointments(): void {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    this.patientService.getAppointments(userId, 'user').subscribe((response: any) => {
      this.appointments = response.appointments;
    });
  }

  loadClaims(): void {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    const isAdmin = localStorage.getItem('role') === 'admin' ? 1 : 0;
  
    this.patientService.getInsuranceClaims(userId, isAdmin).subscribe((response: { success: boolean, claims: any[] }) => {
      console.log(response);  // Log the response to check its structure
      if (response.success) {
        this.claims = Array.isArray(response.claims) ? response.claims : []; // Ensure it's an array
      } else {
        console.log('Failed to load claims');
      }
    });
  }
  
  // Handle the change in service type selection
  onServiceTypeChange(event: Event): void {
    const serviceType = (event.target as HTMLSelectElement).value;
    this.currentServiceType = serviceType;
    this.setDiscount(serviceType);
    this.initializeForm(serviceType);
  }

   // Handle the change in appointment selection
   onAppointmentChange(event: Event): void {
    const selectedAppointmentId = (event.target as HTMLSelectElement).value;
    const selectedAppointment = this.appointments.find(
      (appointment) => appointment.id === +selectedAppointmentId
    );
  
    if (selectedAppointment) {
      // Populate the form with appointment details, including the service type
      this.claimForm.patchValue({
        service_type: selectedAppointment.service,
        appointment_id: selectedAppointment.id,
        claim_description: selectedAppointment.description, // Set description from appointment
      });
  
      this.currentServiceType = selectedAppointment.service;
      this.setDiscount(selectedAppointment.service);
      // Enable the service type input dynamically
      this.claimForm.get('service_type')?.enable();
    }
  }
  
  onAppointmentSelect(event: Event): void {
    const appointmentId = (event.target as HTMLSelectElement).value;
    const selectedAppointment = this.appointments.find(app => app.id === +appointmentId);
    if (selectedAppointment) {
      this.currentServiceType = selectedAppointment.service;
      this.claimForm.patchValue({ service_type: selectedAppointment.service });
      this.setDiscount(selectedAppointment.service);
    }
  }

  setDiscount(serviceType: string): void {
    switch (serviceType) {
      case 'Consultation':
        this.discount = 10;
        break;
      case 'Surgery':
        this.discount = 20;
        break;
      case 'Therapy':
        this.discount = 15;
        break;
      default:
        this.discount = 0;
    }
    this.claimForm.patchValue({ discount: this.discount });
  }
  
  // Initialize the form based on the selected service type
  initializeForm(serviceType: string): void {
    switch (serviceType) {
      case 'consultation':
        this.claimForm = this.fb.group({
          patient_name: [''],
          service_type: ['consultation'],
          doctor_name: [''],
          appointment_date: [''],
          reason_for_visit: [''],
          discount: [{ value: 10, disabled: true }],
        });
        break;
      case 'surgery':
        this.claimForm = this.fb.group({
          patient_name: [''],
          service_type: ['surgery'],
          surgery_type: [''],
          surgery_date: [''],
          anesthesia_required: [false],
          surgeon_name: [''],
          discount: [{ value: 20, disabled: true }],
        });
        break;
      case 'therapy':
        this.claimForm = this.fb.group({
          patient_name: [''],
          service_type: ['therapy'],
          therapy_type: [''],
          therapy_sessions: [''],
          therapist_name: [''],
          discount: [{ value: 15, disabled: true }],
        });
        break;
      default:
        this.claimForm.reset();
        break;
    }
  }

  // Create a new claim
  createClaim(): void {
    if (this.claimForm.valid && this.claimForm.value.claim_description.trim() !== '') {
      const claimData = {
        user_id: parseInt(localStorage.getItem('userId') || '0', 10),
        appointment_id: this.claimForm.value.appointment_id,
        description: this.claimForm.value.claim_description,
        service: this.claimForm.value.service_type,  // Add service field here
        discount: this.claimForm.value.discount,
      };
  
      console.log('Submitting claim data:', claimData);  // Add this line to log the data being sent
  
      this.patientService.createInsuranceClaim(claimData).subscribe(response => {
        console.log('Claim created:', response);
        console.log('Claim Description:', this.claimForm.value.claim_description);
        console.log('Appointment ID:', this.claimForm.value.appointment_id);
        this.loadClaims();
        this.claimForm.reset();
      });
    } else {
      console.log('Please provide a description.');
      alert('Description is required!');
    }
  }  
}

