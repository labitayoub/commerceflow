import { IsString, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        example: 'admin@commerceflow.com'})
    @IsEmail()
    email: string;
    @ApiProperty({
        example: 'admin123'})
    @IsString()
    password: string;
}