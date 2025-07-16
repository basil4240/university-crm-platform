import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
  Req,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { AuthenticationGuard } from 'src/common/guards/authentication/authentication.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Role } from '@prisma/client';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ActiveUserData } from 'src/common/interfaces/active-user-data.interface';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('courses')
@UseGuards(RolesGuard)
@UseGuards(AuthenticationGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('syllabus', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          // Generate unique filename with timestamp
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Optional: Add file type validation
        const allowedTypes = /txt|pdf|doc|docx/;
        const extensionname = allowedTypes.test(
          extname(file.originalname).toLowerCase(),
        );
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extensionname) {
          return cb(null, true);
        } else {
          cb(new Error('Only specific file types are allowed!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @Roles(Role.LECTURER)
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          // new FileTypeValidator({ fileType: /(pdf|docx?|txt)$/i }),
        ],
      }),
    )
    syllabus: Express.Multer.File,
    @Body() createCourseDto: CreateCourseDto,
    @Req() request: Request,
    @ActiveUser() activeUserData: ActiveUserData,
  ) {
    if (!syllabus) {
      throw new BadRequestException('Syllabus is required');
    }

    // Get the base URL (works for localhost and remote)
    const protocol = request.protocol;
    const host = request.get('host');
    const baseUrl = `${protocol}://${host}`;

    // Create the file URL
    const fileUrl = `${baseUrl}/uploads/${syllabus.filename}`;

    // Add file URL to DTO
    createCourseDto.syllabus = fileUrl;

    return this.coursesService.create(createCourseDto, activeUserData);
  }

  @Get()
  @Roles(Role.LECTURER, Role.ADMIN, Role.STUDENT)
  browse(
    @Query() paginationDto: PaginationDto,
    @ActiveUser() activeUserData: ActiveUserData,
  ) {
    return this.coursesService.browse(activeUserData, paginationDto);
  }

  @Get('enrolled')
  @Roles(Role.STUDENT)
  enrolled(
    @Query() paginationDto: PaginationDto,
    @ActiveUser() activeUserData: ActiveUserData,
  ) {
    return this.coursesService.enrolled(activeUserData, paginationDto);
  }

  @Patch('enroll/:id')
  @Roles(Role.STUDENT)
  enroll(
    @ActiveUser() activeUserData: ActiveUserData,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.coursesService.enroll(id, activeUserData);
  }

  @Patch('drop/:id')
  @Roles(Role.STUDENT)
  drop(
    @ActiveUser() activeUserData: ActiveUserData,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.coursesService.drop(id, activeUserData);
  }

  @Patch('approve/:enrollmentId')
  @Roles(Role.ADMIN)
  approve(
    @ActiveUser() activeUserData: ActiveUserData,
    @Param('enrollmentId', ParseIntPipe) enrollmentId: number,
  ) {
    return this.coursesService.approve(enrollmentId, activeUserData);
  }

  @Patch('reject/:enrollmentId')
  @Roles(Role.ADMIN)
  reject(
    @ActiveUser() activeUserData: ActiveUserData,
    @Param('enrollmentId', ParseIntPipe) enrollmentId: number,
  ) {
    return this.coursesService.reject(enrollmentId, activeUserData);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('syllabus', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          // Generate unique filename with timestamp
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Optional: Add file type validation
        const allowedTypes = /txt|pdf|doc|docx/;
        const extensionname = allowedTypes.test(
          extname(file.originalname).toLowerCase(),
        );
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extensionname) {
          return cb(null, true);
        } else {
          cb(new Error('Only specific file types are allowed!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @Roles(Role.LECTURER)
  update(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          // new FileTypeValidator({ fileType: /(pdf|docx?|txt)$/i }),
        ],
        fileIsRequired: false,
      }),
    )
    syllabus: Express.Multer.File,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() request: Request,
    @ActiveUser() activeUserData: ActiveUserData,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (syllabus) {
      // Get the base URL (works for localhost and remote)
      const protocol = request.protocol;
      const host = request.get('host');
      const baseUrl = `${protocol}://${host}`;

      // Create the file URL
      const fileUrl = `${baseUrl}/uploads/${syllabus.filename}`;

      console.log(fileUrl);

      // Add file URL to DTO
      updateCourseDto.syllabus = fileUrl;
    } else {
      updateCourseDto.syllabus = undefined;
    }

    return this.coursesService.update(id, updateCourseDto, activeUserData);
  }
}
