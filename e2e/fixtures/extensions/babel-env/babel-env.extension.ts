import { EnvsMain, EnvsAspect } from '@teambit/environments';
import { ReactAspect, ReactMain } from '@teambit/react';
import { BabelAspect, BabelMain } from '@teambit/babel';

const  babelConfig = require('./babel.config.json');

export class BabelEnv {
  constructor(private react: ReactMain) {}

  /**
   * icon of the extension.
   */
  icon() {
    return this.react.icon;
  }

  static dependencies: any = [EnvsAspect, ReactAspect, BabelAspect];

  static async provider([envs, react, babel]: [EnvsMain, ReactMain, BabelMain]) {
    const compilerOverride = envs.override({
      getCompiler: () => {
        return babel.createCompiler({ babelTransformOptions: babelConfig })
      },
    });
    const harmonyReactEnv = react.compose([
      compilerOverride
    ]);

    envs.registerEnv(harmonyReactEnv);
    return new BabelEnv(react);
  }
}
