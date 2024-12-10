import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BillingService } from './billing.service';

describe('BillingService', () => {
  let service: BillingService;
  let httpMock: HttpTestingController;
  const mockBaseUrl = 'http://localhost/Clinic-System/clinicapi';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Mock HttpClient
      providers: [BillingService], // Provide the BillingService
    });
    service = TestBed.inject(BillingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login a user', () => {
    const mockResponse = { message: 'Login successful.', user_id: 1, role: 'admin' };
    const username = 'testuser';
    const password = 'testpassword';

    // Call the service's login method
    service.login(username, password).subscribe((response) => {
      expect(response.message).toBe('Login successful.');
      expect(response.user_id).toBe(1);
      expect(response.role).toBe('admin');
    });

    // Mock the API request and response
    const req = httpMock.expectOne(`${mockBaseUrl}/api/auth/login.php`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse); // Respond with the mock data
  });

  it('should handle error response on login', () => {
    const errorResponse = { message: 'Login failed.' };
    const username = 'invaliduser';
    const password = 'invalidpassword';

    service.login(username, password).subscribe(
      () => {},
      (error) => {
        expect(error).toBe('Login failed.');
      }
    );

    // Mock the error response
    const req = httpMock.expectOne(`${mockBaseUrl}/api/auth/login.php`);
    expect(req.request.method).toBe('POST');
    req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
  });

  it('should register a user', () => {
    const mockResponse = { message: 'Registration successful.' };
    const username = 'testuser';
    const password = 'testpassword';
    const name = 'Test User';
    const contactNumber = '1234567890';
    const dateOfBirth = '2000-01-01';

    service.register(username, password, name, contactNumber, dateOfBirth).subscribe((response) => {
      expect(response.message).toBe('Registration successful.');
    });

    const req = httpMock.expectOne(`${mockBaseUrl}/api/users/register.php`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle error response on registration', () => {
    const errorResponse = { message: 'Registration failed.' };
    const username = 'testuser';
    const password = 'testpassword';
    const name = 'Test User';
    const contactNumber = '1234567890';
    const dateOfBirth = '2000-01-01';

    service.register(username, password, name, contactNumber, dateOfBirth).subscribe(
      () => {},
      (error) => {
        expect(error).toBe('Registration failed.');
      }
    );

    const req = httpMock.expectOne(`${mockBaseUrl}/api/users/register.php`);
    expect(req.request.method).toBe('POST');
    req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
  });
});
