const debug = require('debug')('archwayd');
const { spawn } = require('promisify-child-process');

const KeysCommands = require('./keys');
const TxCommands = require('./tx');

const DefaultArchwaydVersion = 'latest';
const DefaultArchwaydHome = `${process.env.HOME}/.archway`;

/**
 * Facade for the archwayd client, which supports both Docker and binary implementations.
 */
class ArchwayClient {
  #archwaydHome;
  #extraArgs;
  #keys;
  #tx;

  constructor({ archwaydHome = DefaultArchwaydHome, extraArgs = [] }) {
    this.#archwaydHome = archwaydHome;
    this.#extraArgs = extraArgs;
    this.#keys = new KeysCommands(this);
    this.#tx = new TxCommands(this);
  }

  get command() {
    return 'archwayd';
  }

  get archwaydHome() {
    return this.#archwaydHome;
  }

  get extraArgs() {
    return this.#extraArgs;
  }

  get workingDir() {
    return '.';
  }

  get keys() {
    return this.#keys;
  }

  get tx() {
    return this.#tx;
  }

  parseArgs(args = []) {
    // TODO: add support for --home
    return [...this.extraArgs, ...args];
  }

  run(subCommand, args = [], options = { stdio: 'inherit' }) {
    const command = this.command;
    const parsedArgs = this.parseArgs([subCommand, ...args]);
    debug(command, ...parsedArgs);
    return spawn(command, parsedArgs, { ...options, encoding: 'utf8' });
  }
}

// TODO: deprecate Docker support
class DockerArchwayClient extends ArchwayClient {
  constructor({ archwaydVersion = DefaultArchwaydVersion, testnet, ...options }) {
    super(options);
    this.archwaydVersion = testnet || archwaydVersion;
  }

  get command() {
    return 'docker';
  }

  get workingDir() {
    return this.archwaydHome;
  }

  get extraArgs() {
    const dockerArgs = DockerArchwayClient.#getDockerArgs(this.workingDir, this.archwaydVersion);
    return [...dockerArgs, ...super.extraArgs];
  }

  static #getDockerArgs(archwaydHome, archwaydVersion) {
    return [
      'run',
      '--pull',
      'always',
      '--rm',
      '-it',
      `--volume=${archwaydHome}:/root/.archway`,
      `archwaynetwork/archwayd:${archwaydVersion}`
    ];
  }
}

// TODO: remove when Docker support is removed
async function clientFactory({ docker = false, ...options } = {}) {
  if (docker) {
    return new DockerArchwayClient(options);
  } else {
    return new ArchwayClient(options);
  }
}

// TODO: export only ArchwayClient when Docker support is removed
module.exports = Object.assign(ArchwayClient, {
  DefaultArchwaydHome,
  DefaultArchwaydVersion,
  createClient: clientFactory
});
