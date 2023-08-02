import { CargoProjectMetadata, DeploymentWithChain } from '@/types';

/**
 * Contract information
 */
export interface Contract extends CargoProjectMetadata {
  deployments: DeploymentWithChain[];
}

/**
 * Options for the instantiate-permission flag
 */
export enum InstantiatePermission {
  ANY_OF = 'any-of',
  EVERYBODY = 'everybody',
  NOBODY = 'nobody',
}