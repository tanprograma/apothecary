import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'shop/:name/:id/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'home',
    renderMode: RenderMode.Client,
  },
  {
    path: 'login',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
