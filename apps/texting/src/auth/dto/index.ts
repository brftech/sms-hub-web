import { IsEmail, IsNotEmpty, IsString, IsNumber, IsPhoneNumber, IsOptional } from 'class-validator'

export class CreateTempSignupDto {
  @IsNumber()
  hub_id: number

  @IsNotEmpty()
  @IsString()
  company_name: string

  @IsNotEmpty()
  @IsString()
  first_name: string

  @IsNotEmpty()
  @IsString()
  last_name: string

  @IsPhoneNumber('US')
  mobile_phone_number: string

  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  auth_method?: string = 'sms'
}

export class VerifyCodeDto {
  @IsNotEmpty()
  @IsString()
  temp_signup_id: string

  @IsNotEmpty()
  @IsString()
  verification_code: string
}