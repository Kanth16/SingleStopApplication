import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayComponent } from './display/display.component';
import { TestingComponent } from './testing/testing.component';
import { LinterComponent } from './linter/linter.component';
import { FilesComponent } from './files/files.component';
import { CreateComponent} from './create/create.component';
import { AdvSearchComponent } from './adv-search/adv-search.component'

const routes: Routes = [
  { path:'select/:tablename', component: DisplayComponent },
  { path: 'test', component: TestingComponent },
  { path: 'linter',component: LinterComponent },
  { path :"files", component:FilesComponent },
  { path :"create", component:CreateComponent },
  { path: 'search',component:AdvSearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation:'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
