import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";

export class AuthResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    user: {
        id:string;
        email:string;
        firstName:string;
        lastName:string;
        role:Role;
    };
}