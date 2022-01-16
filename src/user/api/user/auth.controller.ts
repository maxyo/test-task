import {Body, Controller, Post} from "@nestjs/common";
import {LoginDto, LoginResponseDto} from "./dto/auth.dto";
import {AuthService} from "../../service/auth.service";

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(
      dto.email,
      dto.password,
    )
  }
}
