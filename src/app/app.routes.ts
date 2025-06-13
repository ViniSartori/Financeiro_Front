import { Routes } from '@angular/router';

import { ContasComponent } from './pages/contas/contas.component';
import { CashFlowComponent } from '../app/pages/movimentacoes/movimentacoes.component';

export const routes: Routes = [
    { path: '', component: CashFlowComponent},
    { path: 'conta', component: ContasComponent}
    
];
