import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { FileService } from 'src/common/services/file/file.service';
import { ActiveUserData } from 'src/common/interfaces/active-user-data.interface';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EnrollmentStatus } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async create(
    createCourseDto: CreateCourseDto,
    activeUserData: ActiveUserData,
  ) {
    try {
      const course = await this.prismaService.course.create({
        data: {
          ...createCourseDto,
          lecturerId: activeUserData.sub,
          // title: createCourseDto.title,
          // credits: createCourseDto.credits,
          // syllabus: createCourseDto.syllabus,
          // description: createCourseDto.description,
          // semester: createCourseDto.semester,
          // year: createCourseDto.year,
        },
      });

      return {
        message: 'Successful',
        data: course,
      };
    } catch (error) {
      console.log(error);
      await this.fileService.deleteFileByUrl(createCourseDto.syllabus);
      throw new BadRequestException();
    }
  }

  async update(
    id: number,
    updateCourseDto: UpdateCourseDto,
    activeUserData: ActiveUserData,
  ) {
    const oldCourse = await this.prismaService.course.findFirst({
      where: { id, lecturerId: activeUserData.sub },
    });

    if (!oldCourse) {
      if (updateCourseDto.syllabus) {
        await this.fileService.deleteFileByUrl(oldCourse.syllabus);
      }
      throw new NotFoundException();
    }

    const newCourse = await this.prismaService.course.update({
      where: { id, lecturerId: activeUserData.sub },
      data: {
        ...updateCourseDto,
      },
    });

    if (updateCourseDto.syllabus) {
      await this.fileService.deleteFileByUrl(oldCourse.syllabus);
    }

    return {
      message: 'Successful',
      data: newCourse,
    };
  }

  async browse(activeUserData: ActiveUserData, paginationDto: PaginationDto) {
    const pageSize = paginationDto.pageSize;
    const page = paginationDto.page;

    const take = pageSize;
    const skip = (page - 1) * take;

    const courses = await this.prismaService.course.findMany({
      take,
      skip,
    });

    const total = await this.prismaService.course.count({});

    const hasNextPage = total > page * take;
    const hasPrevPage = page > 1;

    return {
      message: 'Successful',
      data: courses,
      pagination: {
        next: hasNextPage,
        prev: hasPrevPage,
        total: total,
      },
    };
  }

  async enroll(id: number, activeUserData: ActiveUserData) {
    const course = await this.prismaService.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    try {
      const enrollment = await this.prismaService.enrollment.create({
        data: {
          courseId: course.id,
          studentId: activeUserData.sub,
        },
      });

      return {
        message: 'Successfull',
        data: enrollment,
      };
    } catch (error) {
      throw new ConflictException('User already enrolled in this course');
    }
  }

  async drop(id: number, activeUserData: ActiveUserData) {
    const course = await this.prismaService.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // drop the course
    try {
      await this.prismaService.enrollment.delete({
        where: {
          courseId_studentId: {
            courseId: course.id,
            studentId: activeUserData.sub,
          },
        },
      });

      return {
        message: 'successfull',
      };
    } catch (error) {
      throw new BadRequestException('Enrolment not found');
    }
  }

  async reject(enrollmentId: number, activeUserData: ActiveUserData) {
    try {
      const enrollment = await this.prismaService.enrollment.update({
        where: {
          id: enrollmentId,
        },
        data: {
          status: EnrollmentStatus.REJECTED,
        },
      });

      return {
        message: 'successfull',
      };
    } catch (error) {
      throw new BadRequestException('Enrolment not found');
    }
  }
  async approve(enrollmentId: number, activeUserData: ActiveUserData) {
    try {
      const enrollment = await this.prismaService.enrollment.update({
        where: {
          id: enrollmentId,
        },
        data: {
          status: EnrollmentStatus.APPROVED,
        },
      });

      return {
        message: 'successfull',
      };
    } catch (error) {
      throw new BadRequestException('Enrolment not found');
    }
  }

  async enrolled(activeUserData: ActiveUserData, paginationDto: PaginationDto) {
    
    const pageSize = paginationDto.pageSize;
    const page = paginationDto.page;

    const take = pageSize;
    const skip = (page - 1) * take;

    const courses = await this.prismaService.enrollment.findMany({
      where: {
        studentId: activeUserData.sub
      },
      include: {
        course: true
      },
      take,
      skip,
    });

    const total = await this.prismaService.course.count({});

    const hasNextPage = total > page * take;
    const hasPrevPage = page > 1;

    return {
      message: 'Successful',
      data: courses,
      pagination: {
        next: hasNextPage,
        prev: hasPrevPage,
        total: total,
      },
    };

  }
}
