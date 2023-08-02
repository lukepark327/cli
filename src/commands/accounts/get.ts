import { Flags } from '@oclif/core';

import { BaseCommand } from '@/lib/base';
import { accountRequired } from '@/arguments';
import { Accounts } from '@/domain';
import { KeyringFlags } from '@/flags';

import { BackendType } from '@/types';

/**
 * Command 'accounts get'
 * DIsplays details about an account. This command cannot print the mnemonic.
 */
export default class AccountsGet extends BaseCommand<typeof AccountsGet> {
  static summary = 'Displays details about an account';
  static args = {
    account: accountRequired,
  };

  static flags = {
    address: Flags.boolean({ description: 'Display the address only' }),
    ...KeyringFlags,
  };

  /**
   * Runs the command.
   *
   * @returns Empty promise
   */
  public async run(): Promise<void> {
    const accountsDomain = await Accounts.init(this.flags['keyring-backend'] as BackendType, { filesPath: this.flags['keyring-path'] });
    const account = await accountsDomain.get(this.args.account!);

    if (this.flags.address) {
      this.log(account.address);
      if (this.jsonEnabled()) this.logJson({ account: { address: account.address } });
    } else {
      this.log(`${Accounts.prettyPrintNameAndAddress(account)}\n\n${Accounts.prettyPrintPublicKey(account.publicKey)}`);
      if (this.jsonEnabled()) this.logJson(account);
    }
  }
}