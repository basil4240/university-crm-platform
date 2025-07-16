import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class RegistrationResponse {
  /**
   * The unique identifier for the registered user.
   */
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  id: string;

  /**
   * The email address of the registered user.
   */
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  /**
   * The role assigned to the user.
   */
  @ApiProperty({ enum: Role, default: Role.STUDENT })
  @IsEnum(Role)
  role: Role;

  /**
   * The first name of the user.
   */
  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  /**
   * The last name of the user.
   */
  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;
}
