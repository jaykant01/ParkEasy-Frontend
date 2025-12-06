import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyParkspace } from './my-parkspace';

describe('MyParkspace', () => {
  let component: MyParkspace;
  let fixture: ComponentFixture<MyParkspace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyParkspace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyParkspace);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
