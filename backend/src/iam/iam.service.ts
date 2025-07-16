import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterationDto } from './dtos/registeration.dto';
import { HashingService } from 'src/common/services/hashing/hashing.service';
import { ActiveUserData } from 'src/common/interfaces/active-user-data.interface';
import { HelperService } from 'src/common/services/helper/helper.service';

@Injectable()
export class IamService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly helperService: HelperService,
  ) {}

  async register(body: RegisterationDto) {
    // check if email exist
    const foundUser = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });

    // if user exist and has verify email
    if (foundUser) {
      throw new ConflictException({ message: 'User already exist' });
    }

    // hash the password
    const hashedPassword = await this.hashingService.hash(body.password);

    // create the user
    const user = await this.prismaService.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        role: body.role,
        firstName: body.firstName,
        lastName: body.lastName,
      },
    });

    return {
      message: 'User registration successful',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async login(body: LoginDto) {
    // check if user exists
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });

    // throw error if user does not exists
    if (!user) {
      throw new NotFoundException('User Does not Exist');
    }

    // compare and check if the passwords matches
    const isValidPassword = await this.hashingService.compare(
      body.password,
      user.password,
    );

    // check if password matches
    if (!isValidPassword) {
      throw new NotFoundException('User Does not Existhhhh');
    }

    // token payload
    const tokenPayload: ActiveUserData = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // generate access and refresh token
    const [accessToken, refreshToken] =
      await this.helperService.generateJwtTokens(tokenPayload);

    return {
      message: 'User login successful',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        accessToken,
        refreshToken,
      },
    };
  }
  
}
