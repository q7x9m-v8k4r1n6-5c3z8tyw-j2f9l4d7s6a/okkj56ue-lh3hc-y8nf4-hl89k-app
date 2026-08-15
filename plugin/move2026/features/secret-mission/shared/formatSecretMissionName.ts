export const formatSecretMissionName = (name: string, isAssigned: boolean): string =>
  isAssigned ? `Nhiệm vụ bí mật: ${name}` : `Tech Cache: ${name}`