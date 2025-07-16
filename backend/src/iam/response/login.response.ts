import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class LoginResponse {

    /**
     * The JWT refresh token for obtaining new access tokens.
     */
    @ApiProperty({
        description: 'JWT refresh token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @IsString()
    refreshToken: string;
    /**
     * The JWT access token for authentication.
     */
    @ApiProperty({
        description: 'JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @IsString()
    accessToken: string;

    /**
     * The email address of the user.
     */
    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
    })
    @IsEmail()
    email: string;

    /**
     * The role assigned to the user.
     */
    @ApiProperty({
        description: 'User role',
        enum: Role,
        example: Role.STUDENT,
    })
    @IsEnum(Role)
    role: Role;

    /**
     * The first name of the user.
     */
    @ApiProperty({
        description: 'User first name',
        example: 'John',
        required: false,
        nullable: true,
    })
    @IsOptional()
    @IsString()
    firstName?: string | null;

    /**
     * The last name of the user.
     */
    @ApiProperty({
        description: 'User last name',
        example: 'Doe',
        required: false,
        nullable: true,
    })
    @IsOptional()
    @IsString()
    lastName?: string | null;
    
}