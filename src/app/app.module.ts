import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';

import { AppComponent } from './app.component';
import { SceneComponent } from './scene/scene.component';
import { RendererService } from './services/renderer.service';
@NgModule({
   declarations: [
      AppComponent,
      SceneComponent
   ],
   imports: [
      BrowserModule
   ],
   providers: [
    RendererService
   ],
   bootstrap: [
      AppComponent
   ],
   schemas: [
      CUSTOM_ELEMENTS_SCHEMA
   ]
})
export class AppModule { }
