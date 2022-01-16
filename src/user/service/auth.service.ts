import {BadRequestException, Injectable} from "@nestjs/common";
import {SignService} from "../../common/authorization/service/sign.service";
import {Repository} from "typeorm";
import {User} from "../entity/user.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class AuthService {
  constructor(
    private signService: SignService,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({where: {email}});
    if (!user) throw new BadRequestException('Данные введены неверно');
    const passwordIsValid = await this.signService.validate(password, user.password);
    if (!passwordIsValid) throw new BadRequestException('Данные введены неверно');

    return await this.signService.sign(this.getTokenData(user));
  }

  private getTokenData(user: User) {
    return {
      id: user.id,
      email: user.email
    };
  }

}