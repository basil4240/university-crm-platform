import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiGoneResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { IamService } from './iam.service';
import { LoginDto } from './dtos/login.dto';
import { ExceptionResponse } from 'src/common/responses/exception.response';
import { DataResponse } from 'src/common/responses/data.response';
import { LoginResponse } from './response/login.response';
import { RegisterationDto } from './dtos/registeration.dto';
import { RegistrationResponse } from './response/registration.response';

@Controller('auth')
@ApiInternalServerErrorResponse({
  description:
    'Internal server error occured, this is as a result of server crash or programatic error at the backend. This exception should not be handled by the client. Contact the ',
  type: ExceptionResponse,
})
@ApiServiceUnavailableResponse({
  description: 'Service not available, such as database unavailability, etc.',
  type: ExceptionResponse,
})
@ApiExtraModels(DataResponse, LoginResponse, RegistrationResponse)
@ApiTags('Fixtures Endpoints')
export class IamController {
  constructor(private readonly iamService: IamService) {}
  /**
   * @description This endpoint logs a user in by validating their credentials and returning an authentication token upon success.
   */
  @ApiBody({
    description: 'User login credentials. Requires email and password.',
    type: LoginDto,
  })
  @ApiOkResponse({
    description: 'User successfully logged in. Returns authentication token and user details.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(DataResponse) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(LoginResponse),
            },
          },
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    description:
      'User not found or password does not match. This occurs when an incorrect email or password is provided.',
    type: ExceptionResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials provided.',
    type: ExceptionResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.iamService.login(body);
  }

  /**
   * @description This endpoint registers a new user and returns the created user details upon success.
   */
  @ApiBody({
    description: 'User registration details. Requires name, email, password, and other required fields.',
    type: RegisterationDto,
  })
  @ApiCreatedResponse({
    description:
      'User successfully registered. Returns the newly created user details.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(DataResponse) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(RegistrationResponse),
            },
          },
        },
      ],
    },
  })
  @ApiConflictResponse({
    description: 'A user with the provided email already exists.',
    type: ExceptionResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid registration data provided.',
    type: ExceptionResponse,
  })
  @Post('/register')
  registerUser(@Body() body: RegisterationDto) {
    return this.iamService.register(body);
  }

}
