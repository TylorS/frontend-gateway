import * as fs from 'fs'
import { EOL } from 'os'
import * as path from 'path'
import { PACKAGES, sourceDirectory } from './common'

const FILES_TO_EXCLUDE = [
  './source/**/*.test.ts',
  './source/**/*.browser-test.ts',
  './cjs/**',
  './esm/**',
  './umd/**',
]

updateRootConfig('tsconfig.json')
updateRootConfig('tsconfig.cjs.json')

PACKAGES.forEach(updatePackage)

function updateRootConfig(configName: string) {
  const rootTsConfigPath = path.join(sourceDirectory, configName)
  const rootTsConfig = getOrCreateJsonFile(rootTsConfigPath)
  const packagePaths = PACKAGES.map(pkg => `./${pkg}/${configName}`)

  rootTsConfig.references = packagePaths
    .filter(x => isNotPrivate(x.replace(configName, '')))
    .map(path => ({ path }))
  rootTsConfig.files = []
  delete rootTsConfig.include
  delete rootTsConfig.exclude

  fs.writeFileSync(rootTsConfigPath, JSON.stringify(rootTsConfig, null, '  ') + EOL)
}

function isNotPrivate(pkg: string) {
  const pkgDirectory = path.join(sourceDirectory, pkg)
  const packageJSONPath = path.join(pkgDirectory, 'package.json')

  if (!fs.existsSync(packageJSONPath)) {
    throw new Error(`Run 'npm init' in ${pkgDirectory} before running this script.`)
  }

  const packageJSONData = JSON.parse(fs.readFileSync(packageJSONPath).toString())

  return !packageJSONData.private
}

function updatePackage(pkg: string) {
  const pkgDirectory = path.join(sourceDirectory, pkg)
  const packageJSONPath = path.join(pkgDirectory, 'package.json')

  if (!fs.existsSync(packageJSONPath)) {
    throw new Error(`Run 'npm init' in ${pkgDirectory} before running this script.`)
  }

  const packageJSONData = JSON.parse(fs.readFileSync(packageJSONPath).toString())
  const isPrivate = !!packageJSONData.private
  const typedDependencies = getTypedDependencies(packageJSONData)
  const tsconfigEsmPath = path.join(pkgDirectory, 'tsconfig.json')
  const tsconfigCjsPath = path.join(pkgDirectory, 'tsconfig.cjs.json')

  updatePackageConfig(tsconfigEsmPath, typedDependencies, applyEsmDefaults, isPrivate)
  updatePackageConfig(tsconfigCjsPath, typedDependencies, applyCommonjsDefaults, isPrivate)
}

function updatePackageConfig(
  configPath: string,
  typedDependencies: string[],
  effects: (data: any, isPrivate: boolean) => void,
  isPrivate: boolean,
) {
  console.log(`Updating TsConfig: ${configPath}...`)
  const data = getOrCreateJsonFile(configPath)
  effects(data, isPrivate)

  if (!isPrivate) {
    updateReferences(data, typedDependencies)
  }

  fs.writeFileSync(configPath, JSON.stringify(data, null, '  ') + EOL)
}

function getOrCreateJsonFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}))
  }

  return JSON.parse(fs.readFileSync(filePath).toString())
}

function applyEsmDefaults(tsconfig: any, isPrivate: boolean) {
  tsconfig.extends = '../tsconfig.base.json'

  tsconfig.compilerOptions = {
    ...(tsconfig.compilerOptions || {}),
    composite: true,
    incremental: true,
    rootDir: './source',
    module: 'es2015',
    outDir: './esm',
  }

  if (isPrivate) {
    delete tsconfig.compilerOptions.composite
    delete tsconfig.compilerOptions.incremental
  }

  tsconfig.include = uniq([...(tsconfig.files || []), ...(tsconfig.include || []), 'source'])

  delete tsconfig.files

  tsconfig.exclude = uniq([...(tsconfig.exclude || []), ...FILES_TO_EXCLUDE])
}

function applyCommonjsDefaults(tsconfig: any, isPrivate: boolean) {
  tsconfig.extends = '../tsconfig.base.json'

  tsconfig.compilerOptions = {
    ...(tsconfig.compilerOptions || {}),
    composite: true,
    incremental: true,
    rootDir: './source',
    module: 'commonjs',
    outDir: 'cjs',
  }

  if (isPrivate) {
    delete tsconfig.compilerOptions.composite
    delete tsconfig.compilerOptions.incremental
  }

  tsconfig.include = uniq([...(tsconfig.files || []), ...(tsconfig.include || []), 'source'])

  delete tsconfig.files

  tsconfig.exclude = uniq([...(tsconfig.exclude || []), ...FILES_TO_EXCLUDE])
}

function uniq<A>(values: A[]): A[] {
  return Array.from(new Set(values)).sort()
}

function updateReferences(tsconfig: any, typedDependencies: string[]) {
  if (tsconfig.references) {
    delete tsconfig.references
  }

  const references = typedDependencies.map(getTypedPackageName)
  const referencePaths = references.map(x => `../${x}/tsconfig.json`)

  if (references.length > 0) {
    tsconfig.references = referencePaths.map(path => ({ path }))
  }
}

function getTypedPackageName(packageName: string): string {
  return packageName.replace('@typed/', '')
}

function getTypedDependencies(packageJSON: any): string[] {
  if (!packageJSON.dependencies) {
    return []
  }

  const dependencies = Object.keys(packageJSON.dependencies)

  return dependencies.filter(x => x.startsWith('@typed/'))
}
