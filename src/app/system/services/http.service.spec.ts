import {HttpService} from './http.service';

describe('HttpService', () => {
  let service: HttpService;

  beforeEach(() => {
    service = new HttpService()
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  })

  it("should split an XHR object's array", () => {
    expect(service.transformMappedEntityIDs({
      ID: 0,
      property1: "value",
      property1IDs: "1,2,3,4,5",
      property2: "another value"
    })).toEqual({
      ID: 0,
      property1: "value",
      property1IDs: [1, 2, 3, 4, 5],
      property2: "another value"
    })
  })
})


// import { TestBed } from '@angular/core/testing';

// import { HttpService } from './http.service';

// describe('HttpService', () => {
//   let service: HttpService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(HttpService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });