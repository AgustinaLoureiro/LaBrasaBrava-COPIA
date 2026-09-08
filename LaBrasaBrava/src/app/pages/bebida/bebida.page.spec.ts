import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlatoPage } from './plato.page';

describe('PlatoPage', () => {
  let component: PlatoPage;
  let fixture: ComponentFixture<PlatoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
