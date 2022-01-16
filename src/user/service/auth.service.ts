import {BadRequestException, Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Repository} from "typeorm";
import {User} from "../entity/user.entity";
import {compare, hash} from "bcrypt";
import {InjectRepository} from "@nestjs/typeorm";

const REFRESH_TOKEN_EXPIRES_IN_DAYS = 5;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({where: {email}});
    if (!user) throw new BadRequestException('Данные введены неверно');
    const passwordIsValid = await this.validate(password, user.password);
    if (!passwordIsValid) throw new BadRequestException('Данные введены неверно');

    return await this.sign(this.getTokenData(user));
  }

  private getTokenData(user: User) {
    return {
      id: user.id,
      email: user.email
    };
  }

  async hash(password: string) {
    return await hash(password, 13);
  }

  async validate(password: string, passwordHash: string) {
    return await compare(password, passwordHash);
  }

  private async sign(
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