import { IsDefined, IsString } from 'class-validator';

export class AppConfig {
  @IsDefined()
  @IsString()
  tradingServer: string;

  @IsDefined()
  @IsString()
  ssoServer: string;

  @IsDefined()
  @IsString()
  clientId: string;

  @IsDefined()
  @IsString()
  clientSecret: string;

  public constructor(init?: Partial<AppConfig>) {
    Object.assign(this, init);
  }
}
