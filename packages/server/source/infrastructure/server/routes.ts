import { createRoute, pathJoin } from '@typed/routing'
import { Uuid } from '@typed/uuid'

export type IdParam = { readonly id: Uuid }

const idRoute = '/:id'

export const applicationsRoute = createRoute('/applications')

export const applicationRoute = createRoute<IdParam>(pathJoin([applicationsRoute.path, idRoute]))

export const featuresRoute = createRoute('/features')

export const featureRoute = createRoute<IdParam>(pathJoin([featuresRoute.path, idRoute]))

export const featuresByApplicationRoute = createRoute<IdParam>(
  pathJoin([applicationRoute.path, featuresRoute.path]),
)

export const activationsRoute = createRoute('/activations')

export const featureActivationRoute = createRoute<IdParam>(
  pathJoin([featureRoute.path, activationsRoute.path]),
)
