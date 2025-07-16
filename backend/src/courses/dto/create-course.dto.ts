import { IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating a course.
 */
export class CreateCourseDto {
  /**
   * Title of the course (required).
   * Example: "Introduction to Computer Science"
   */
  @ApiProperty({
    description: 'Title of the course',
    example: 'Introduction to Computer Science',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  title: string;

  /**
   * Number of credits for the course (required).
   * Example: 3
   */
  @ApiProperty({
    description: 'Number of credits for the course',
    example: 3,
  })
  @Type(() => Number)
  @IsPositive()
  credits: number;

  /**
   * Optional description of the course.
   * Example: "This course covers the fundamental principles of computer science..."
   */
  @ApiPropertyOptional({
    description: 'Optional description of the course',
    example:
      'This course covers the fundamental principles of computer science...',
  })
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Optional semester name or label.
   * Example: "Fall"
   */
  @ApiPropertyOptional({
    description: 'Semester in which the course is offered',
    example: 'Fall',
  })
  @IsOptional()
  @IsString()
  semester?: string;

  /**
   * Optional year the course is offered.
   * Example: 2025
   */
  @ApiPropertyOptional({
    description: 'Year in which the course is offered',
    example: 2025,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @IsPositive()
  year?: number;

  syllabus?: string;
}
