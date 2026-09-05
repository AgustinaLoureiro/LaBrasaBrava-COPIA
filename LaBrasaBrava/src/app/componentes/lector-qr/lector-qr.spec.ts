import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LectorQrComponent } from './lector-qr.component';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('LectorQrComponent', () => {
  let component: LectorQrComponent;
  let fixture: ComponentFixture<LectorQrComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LectorQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

