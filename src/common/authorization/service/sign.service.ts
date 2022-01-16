import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {compare, hash} from "bcrypt";

const REFRESH_TOKEN_EXPIRES_IN_DAYS = 5;

@Injectable()
export class SignService {
  constructor(
    private jwtService: JwtService,
  ) {}


  public async hash(password: string) {
    return await hash(password, 13);
  }

  public async validate(password: string, passwordHash: string) {
    return await compare(password, passwordHash);
  }

  public async sign(
    data: object,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const signedRefreshToken = this.jwtService.sign(
      { },
      { expiresIn: `${REFRESH_TOKEN_EXPIRES_IN_DAYS} days` },
    );
    return {
      accessToken: await this.jwtService.signAsync(data, { expiresIn: '5 days' }),
      refreshToken: signedRefreshToken,
    };
  }

}