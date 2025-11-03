import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteStateService {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public setupRouteListener(
    destroyRef: DestroyRef,
    onIdChange: (id: string | null) => void,
    cleanupRoutes: string[] = []
  ): void {
    this.activatedRoute.firstChild?.paramMap
      .pipe(
        takeUntilDestroyed(destroyRef),
        map((params) => params.get('id'))
      )
      .subscribe((id) => onIdChange(id));

    this.router.events
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe(() => {
        const currentUrl = this.router.url;
        const shouldCleanup = cleanupRoutes.some(route =>
          !currentUrl.includes(route)
        );

        if (shouldCleanup) {
          onIdChange(null);
        }
      });
  }

  public navigateWithId(baseRoute: string, id: string | null): void {
    const params = id ? [baseRoute, id] : [baseRoute];
    this.router.navigate(params);
  }
}
