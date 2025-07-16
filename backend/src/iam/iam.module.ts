import { Module } from '@nestjs/common';
import { IamService } from './iam.service';
import { IamController } from './iam.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [IamController],
  providers: [IamService],
  imports: [CommonModule]
})
export class IamModule {}
