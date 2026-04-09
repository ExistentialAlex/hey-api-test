import type { MessageSchema } from 'hey-api-test-i18n';
import type { ShapeOf } from 'hey-api-test-types';
import type { RouteLocationNormalized } from 'vue-router';
import type { RouteNamedMap } from 'vue-router/auto-routes';
import type { AppBreadcrumb } from './breadcrumb.type';

export interface RouteMeta<TRouteName extends keyof RouteNamedMap> {
  requiresAuth: boolean;
  breadcrumbs?: AppBreadcrumb<TRouteName>[];
  title: ShapeOf<MessageSchema>;
  titleParams?: Record<string, (route: RouteLocationNormalized<TRouteName>) => string>;
}
