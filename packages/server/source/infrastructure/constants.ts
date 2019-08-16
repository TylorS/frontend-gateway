import { getEnvValue } from './getEnvValue'

export const PORT = getEnvValue('PORT', 8000)
export const USE_HTTP2 = getEnvValue('USE_HTTP2', true)
