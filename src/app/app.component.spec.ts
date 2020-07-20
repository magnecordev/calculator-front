import {AppComponent} from "../app/app.component"

describe("AppComponent", () => {

  let fixture: AppComponent
  let _authenticationService
  let _router
  let _shellService = ({getStates: jest.fn()} as any)

  beforeEach(() => {
    fixture = new AppComponent(_authenticationService, _router, _shellService)
  })

  it("should instantiate AppComponent", () => expect(fixture).toBeTruthy())

  it("should retrieve States", async () => {
    await fixture.ngOnInit()
    expect(fixture._shellService.getStates).toHaveBeenCalled()
  })

})

// import { TestBed, async } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { AppComponent } from './app.component';

// describe('AppComponent', () => {
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         RouterTestingModule
//       ],
//       declarations: [
//         AppComponent
//       ],
//     }).compileComponents();
//   }));

//   it('should create the app', () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.componentInstance;
//     expect(app).toBeTruthy();
//   });

//   it(`should have as title 'MagnecorPricingCalculator'`, () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.componentInstance;
//     expect(app.title).toEqual('MagnecorPricingCalculator');
//   });

//   it('should render title', () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     fixture.detectChanges();
//     const compiled = fixture.nativeElement;
//     expect(compiled.querySelector('.content span').textContent).toContain('MagnecorPricingCalculator app is running!');
//   });
// });