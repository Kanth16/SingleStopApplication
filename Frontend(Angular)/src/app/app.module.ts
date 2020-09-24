import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrontComponent } from './front/front.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DisplayComponent } from './display/display.component';
import { TestingComponent } from './testing/testing.component';
import { LinterComponent } from './linter/linter.component';
import { FilesComponent } from './files/files.component';
import { CreateComponent } from './create/create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule} from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CoverageComponent } from './coverage/coverage.component';
import { AdvSearchComponent } from './adv-search/adv-search.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCardModule} from '@angular/material/card';
@NgModule({
  declarations: [
    AppComponent,
    FrontComponent,
    DisplayComponent,
    TestingComponent,
    LinterComponent,
    FilesComponent,
    CreateComponent,
    CoverageComponent,
    AdvSearchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    ReactiveFormsModule,
    MatToolbarModule,
    DragDropModule,
    MatDialogModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [FrontComponent]
})
export class AppModule { }
