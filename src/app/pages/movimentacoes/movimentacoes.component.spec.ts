import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowComponent } from './movimentacoes.component';

describe('MovimentacoesComponent', () => {
  let component: CashFlowComponent;
  let fixture: ComponentFixture<CashFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashFlowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
