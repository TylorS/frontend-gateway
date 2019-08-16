export function getEnvValue(key: string, fallback?: string): string
export function getEnvValue(key: string, fallback: boolean): boolean
export function getEnvValue(key: string, fallback: number): number
export function getEnvValue(
  key: string,
  fallback?: string | number | boolean,
): string | number | boolean {
  if (typeof fallback === 'boolean') {
    return key in process.env ? process.env[key] !== 'false' : fallback
  }

  if (typeof fallback === 'number') {
    return key in process.env ? parseFloat(process.env[key]!) : fallback
  }

  if (fallback === void 0) {
    return getRequiredValue(key)
  }

  return process.env[key] || fallback
}

function getRequiredValue(key: string): string {
  const value = process.env[key]

  if (!value) {
    throw new Error(`'${key}' must be defined in environment variables`)
  }

  return value
}
