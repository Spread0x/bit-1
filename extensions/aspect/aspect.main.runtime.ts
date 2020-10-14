import { AspectLoaderAspect, AspectLoaderMain } from '@teambit/aspect-loader';
import { BabelAspect, BabelMain } from '@teambit/babel';
import { BuilderAspect, BuilderMain } from '@teambit/builder';
import { MainRuntime } from '@teambit/cli';
import { CompilerAspect, CompilerMain } from '@teambit/compiler';
import { EnvsAspect, EnvsMain, EnvTransformer } from '@teambit/environments';
import { ReactAspect, ReactMain } from '@teambit/react';
import { AspectAspect } from './aspect.aspect';
import { AspectEnv } from './aspect.env';
import { CoreExporterTask } from './core-exporter.task';

export class AspectMain {
  constructor(readonly aspectEnv: AspectEnv, private envs: EnvsMain) {}

  /**
   * compose your own aspect environment.
   */
  compose(transformers: EnvTransformer[] = []) {
    return this.envs.compose(this.aspectEnv, transformers);
  }

  static runtime = MainRuntime;
  static dependencies = [ReactAspect, EnvsAspect, BuilderAspect, AspectLoaderAspect, BabelAspect, CompilerAspect];

  static async provider([react, envs, builder, aspectLoader, babel, compiler]: [
    ReactMain,
    EnvsMain,
    BuilderMain,
    AspectLoaderMain,
    BabelMain,
    CompilerMain
  ]) {
    const aspectEnv = envs.merge<AspectEnv>(new AspectEnv(react.reactEnv, babel, compiler), react.reactEnv);
    const coreExporterTask = new CoreExporterTask(aspectEnv, aspectLoader);
    if (!__dirname.includes('@teambit/bit')) {
      builder.registerBuildTask(coreExporterTask);
    }

    envs.registerEnv(aspectEnv);
    return new AspectMain(aspectEnv, envs);
  }
}

AspectAspect.addRuntime(AspectMain);
