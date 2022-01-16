export function getEnvFilesPath(): string[] {
  const currentEnv = process.env.ENVIRONMENT;

  switch (currentEnv) {
  case 'dev':
    return ['.env.dev', '.env.local'];
  case 'production':
    return ['.env.production'];
  case 'testing':
    return ['.env.testing'];
  default:
    throw Error(`Unexpected environment ${currentEnv}`)
  }
}