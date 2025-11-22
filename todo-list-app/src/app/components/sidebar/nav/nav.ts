import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { APP_ROUTES } from '../../../shared/util/constants';
import { LangDefinition, TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { Button } from '../../../shared/ui/button/button';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, TranslocoModule, CommonModule, Button],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  protected APP_ROUTES = APP_ROUTES;
  private translateService = inject(TranslocoService);
  protected availableLangs = this.translateService.getAvailableLangs() as LangDefinition[];
  protected activeLang = this.translateService.getActiveLang();

  public switchLang(lang: string): void {
    this.translateService.setActiveLang(lang);
    this.activeLang = lang;
  }
}
