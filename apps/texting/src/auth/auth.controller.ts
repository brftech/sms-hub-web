import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateTempSignupDto, VerifyCodeDto } from './dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async createTempSignup(@Body() createTempSignupDto: CreateTempSignupDto) {
    return this.authService.createTempSignup(createTempSignupDto)
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.authService.verifyCode(verifyCodeDto)
  }

  @Post('complete-signup')
  @HttpCode(HttpStatus.CREATED)
  async completeSignup(@Body('temp_signup_id') tempSignupId: string) {
    return this.authService.createUserFromTempSignup(tempSignupId)
  }
}