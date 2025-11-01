import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteStateService {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public setupRouteListener(
    destroy$: Subject<void>,
    onIdChange: (id: string | null) => void,
    cleanupRoutes: string[] = []
  ): void {
    this.activatedRoute.firstChild?.paramMap
      .pipe(
        takeUntil(destroy$),
        map((params) => params.get('id'))
      )
      .subscribe((id) => onIdChange(id));

    this.router.events
      .pipe(takeUntil(destroy$))
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
