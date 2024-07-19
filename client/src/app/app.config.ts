import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_SELECT_CONFIG, MAT_SELECT_SCROLL_STRATEGY, MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/select';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(),
    // ,BrowserModule,
    // CommonModule
    importProvidersFrom(BrowserAnimationsModule),

    // MAT_SELECT_CONFIG
    // useValue: { overlayPanelClass: 'custom-select-panel' }
    // { provide: OverlayContainer, useClass: CustomOverlayContainer }
    // OverconstrainedError,
    // CustomOverlayContainer
    // MAT_SELECT_SCROLL_STRATEGY
    // scrollFactory
    // Overlay
  ]
};
