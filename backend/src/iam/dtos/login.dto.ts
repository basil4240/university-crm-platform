/**
 * Data Transfer Object for user login.
 *
 * Contains the required fields for authenticating a user,
 * including email and password. Used for validating and documenting
 * login requests in the authentication module.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  /**
   * The email address of the user.
   * @example "user@example.com"
   */
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * The password of the user.
   * @example "strongPassword123"
   */
  @ApiProperty({
    example: 'strongPassword123',
    description: 'The password of the user',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
