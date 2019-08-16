import { DropKeys } from '@typed/common'
import { HttpRequest } from '@typed/http'
import { Feature } from './types'

export interface FeatureRepo {
  readonly getAll: () => HttpRequest<readonly Feature[]>
  readonly getById: (featureId: Feature['id']) => HttpRequest<Feature>
  readonly create: (feature: DropKeys<Feature, 'id'>) => HttpRequest<Feature>
  readonly update: (feature: Feature) => HttpRequest<Feature>
  readonly delete: (featureId: Feature['id']) => HttpRequest<{ readonly success: boolean }>
}
