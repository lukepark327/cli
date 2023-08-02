import _ from 'lodash';
import { prompt, prompts, inject, override, PromptObject, Answers, Options } from 'prompts';

import { yellow } from '@/utils';
import { ErrorCodes } from '@/exceptions';

import { ConsoleError } from '@/types';

/**
 * Handle user canceling the prompt
 */
const onCancel = () => {
  throw new PromptCanceledError();
};

/**
 * Display a prompt to the user to enter a value or select an option
 *
 * @param questions - A single {@link Prompt} or an array of it, that will be prompted to the user
 * @param options - Optional - Prompt options
 * @returns Promise containing the values that were input by the user
 */
export const showPrompt = async (questions: PromptObject | PromptObject[], options?: Options): Promise<Answers<any>> => {
  return prompt(questions, { onSubmit: options?.onSubmit || _.noop, onCancel: options?.onCancel || onCancel });
};

/**
 * Error when a prompt is canceled by the user
 */
export class PromptCanceledError extends ConsoleError {
  constructor() {
    super(ErrorCodes.PROMPT_CANCELED);
  }

  /**
   * {@inheritDoc ConsoleError.toConsoleString}
   */
  toConsoleString(): string {
    return `${yellow('Operation canceled')}`;
  }
}

export { prompts, inject, override };
