import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage.service';

@Injectable()
export class LocalStorageService implements StorageService{}
