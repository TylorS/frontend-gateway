import { DropKeys } from '@typed/common'
import { HttpRequest } from '@typed/http'
import { FeatureActivation } from './types'

export interface FeatureActivationRepo {
  readonly getAll: () => HttpRequest<readonly FeatureActivation[]>
  readonly getById: (featureActivationId: FeatureActivation['id']) => HttpRequest<FeatureActivation>
  readonly create: (
    featureActivation: DropKeys<FeatureActivation, 'id'>,
  ) => HttpRequest<FeatureActivation>
  readonly update: (featureActivation: FeatureActivation) => HttpRequest<FeatureActivation>
  readonly delete: (
    featureId: FeatureActivation['id'],
  ) => HttpRequest<{ readonly success: boolean }>
}
