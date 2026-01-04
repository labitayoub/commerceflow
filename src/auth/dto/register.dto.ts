import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({
    example: 'ayoub.labit@gmail.com'})
    @IsEmail()
    email: string;
    
    @ApiProperty({
      example: '123456789'})
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({
      example: 'ayoub'})
      @IsString()
      @MinLength(3)
      @MaxLength(20)
    firstName: string;

    @ApiProperty({
        example: 'labit'})
        @IsString()
        @MinLength(3)
        @MaxLength(20)
    lastName: string;
}