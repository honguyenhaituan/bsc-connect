import { Global, Module } from '@nestjs/common';
import { readAndValidateEnv } from 'src/share/utils';

import { AppConfig } from './app.config';

@Global()
@Module({
  providers: [
    {
      provide: AppConfig,
      useValue: readAndValidateEnv(AppConfig, ['config.yaml']),
    },
  ],
  exports: [AppConfig],
})
export class AppConfigModule {}
