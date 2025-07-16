import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  IsEnum,
} from 'class-validator';

/**
 * DTO for user registration.
 */
export class RegisterationDto {
  /**
   * User's email address.
   * @example "user@example.com"
   */
  @ApiProperty({
    example: 'user@example.com',
    description: "User's email address",
  })
  @IsEmail()
  email: string;

  /**
   * User's password.
   * @example "strongPassword123"
   */
  @ApiProperty({
    example: 'strongPassword123',
    minLength: 6,
    description: "User's password",
  })
  @IsString()
  @MinLength(6)
  password: string;

  /**
   * User's role.
   * @default STUDENT
   * @example "STUDENT"
   */
  @ApiProperty({
    enum: Role,
    default: Role.STUDENT,
    description: "User's role",
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.STUDENT;

  /**
   * User's first name.
   * @example "John"
   */
  @ApiProperty({
    example: 'John',
    required: false,
    description: "User's first name",
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  /**
   * User's last name.
   * @example "Doe"
   */
  @ApiProperty({
    example: 'Doe',
    required: false,
    description: "User's last name",
  })
  @IsString()
  @IsOptional()
  lastName?: string;
}
