import { IsString, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        example: 'ayoub.labit@gmail.com'})
    @IsEmail()
    email: string;
    @ApiProperty({
        example: '123456789'})
    @IsString()
    password: string;
}