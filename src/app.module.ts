import { Module } from '@nestjs/common';
import { BscModule } from './bsc/bsc.module';
import { AppConfigModule } from './config';

@Module({
  imports: [AppConfigModule, BscModule],
})
export class AppModule {}
