import { Inject, Injectable } from '@nestjs/common';
import jwtConfig from 'src/common/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ActiveUserData } from 'src/common/interfaces/active-user-data.interface';
import { randomUUID } from 'crypto';
import { AuthTokenType } from 'src/common/enums/auth-token-type.enum';

@Injectable()
export class HelperService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async generateJwtTokens(activeUserData: ActiveUserData) {
    const refreshTokenId = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.signJwtToken(activeUserData, AuthTokenType.Access, true),
      this.signJwtToken(
        { ...activeUserData, refreshTokenId },
        AuthTokenType.Refresh,
        false,
      ),
    ]);

    return [accessToken, refreshToken];
  }

  public async verifyRefreshToken(token: string): Promise<ActiveUserData> {
    const payload = await this.jwtService.verifyAsync<ActiveUserData>(token, {
      secret: this.jwtConfiguration.refreshSecret,
      audience: this.jwtConfiguration.tokenAudience,
      issuer: this.jwtConfiguration.tokenIssuer,
    });

    return payload;
  }

  private async signJwtToken(
    activeUserData: ActiveUserData,
    authTokenType: AuthTokenType,
    isToken: boolean,
  ) {
    // generate token
    const token = await this.jwtService.signAsync(activeUserData, {
      audience: this.jwtConfiguration.tokenAudience,
      issuer: this.jwtConfiguration.tokenIssuer,
      secret: isToken
        ? this.jwtConfiguration.secret
        : this.jwtConfiguration.refreshSecret,
      expiresIn:
        authTokenType === AuthTokenType.Access
          ? this.jwtConfiguration.accessTokenTtl
          : this.jwtConfiguration.refreshTokenTtl,
    });

    return token;
  }
}
