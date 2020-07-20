import {AuthenticationService} from "./authentication.service"

describe("AuthenticationService", () => {
  let service: AuthenticationService;
  let httpService

  beforeEach(() => {
    service = new AuthenticationService(httpService)
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

// import {AuthenticationService} from "./authentication.service"
// import {TestBed} from '@angular/core/testing';

// describe('AuthenticationService', () => {
//   let service: AuthenticationService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(AuthenticationService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });