import { DropKeys } from '@typed/common'
import { HttpRequest } from '@typed/http'
import { Application } from './types'

export interface ApplicationRepo {
  readonly getAll: () => HttpRequest<readonly Application[]>
  readonly getById: (applicationId: Application['id']) => HttpRequest<Application>
  readonly create: (application: DropKeys<Application, 'id'>) => HttpRequest<Application>
  readonly update: (application: Application) => HttpRequest<Application>
  readonly delete: (applicationId: Application['id']) => HttpRequest<{ readonly success: boolean }>
}
