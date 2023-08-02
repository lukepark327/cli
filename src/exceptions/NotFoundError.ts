import { bold, red } from '@/utils/style';
import { ErrorCodes } from './ErrorCodes';

import { ConsoleError } from '@/types/ConsoleError';

/**
 * Error when something was not found
 */
export class NotFoundError extends ConsoleError {
  constructor(public description: string, public valueSearched?: string) {
    super(ErrorCodes.NOT_FOUND);
  }

  /**
   * {@inheritDoc ConsoleError.toConsoleString}
   */
  toConsoleString(): string {
    return `${red(this.description)}${this.valueSearched ? bold(` ${this.valueSearched}`) : ''} ${red('not found')}`;
  }
}
