import { Uuid } from '@typed/uuid'

export interface Application {
  readonly id: Uuid
  readonly name: string
  readonly timestamp: Date
}

export interface Feature {
  readonly id: Uuid
  readonly name: string
  readonly timestamp: Date
  readonly activations: readonly FeatureActivation[]
  readonly applicationId: Application['id']
}

export type FeatureActivation =
  | HostnameFeatureActivation
  | PathnameFeatureActivation
  | DependentFeatureActivation

export interface HostnameFeatureActivation {
  readonly id: Uuid
  readonly type: 'hostname'
  readonly featureId: Feature['id']
  readonly hostname: string
}

export interface PathnameFeatureActivation {
  readonly id: Uuid
  readonly type: 'pathname'
  readonly featureId: Feature['id']
  readonly pathname: string
}

export interface DependentFeatureActivation {
  readonly id: Uuid
  readonly type: 'dependent'
  readonly featureId: Feature['id']
  readonly dependentFeatureId: Feature['id']
}
