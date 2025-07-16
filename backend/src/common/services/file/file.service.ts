import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly uploadsPath = join(process.cwd(), 'public/uploads');

  /**
   * Delete a file by filename
   */
  async deleteFile(filename: string): Promise<void> {
    try {
      const filePath = join(this.uploadsPath, filename);
      
      // Check if file exists
      await fs.access(filePath);
      
      // Delete the file
      await fs.unlink(filePath);
      
      this.logger.log(`File deleted successfully: ${filename}`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException(`File not found: ${filename}`);
      }
      this.logger.error(`Error deleting file ${filename}:`, error);
      throw error;
    }
  }

  /**
   * Delete file by full URL (extracts filename from URL)
   */
  async deleteFileByUrl(fileUrl: string): Promise<void> {
    const filename = this.extractFilenameFromUrl(fileUrl);
    await this.deleteFile(filename);
  }

  /**
   * Delete multiple files
   */
  async deleteFiles(filenames: string[]): Promise<void> {
    const deletePromises = filenames.map(filename => 
      this.deleteFile(filename).catch(error => {
        this.logger.error(`Failed to delete ${filename}:`, error);
        return error;
      })
    );
    
    await Promise.all(deletePromises);
  }

  /**
   * Check if file exists
   */
  async fileExists(filename: string): Promise<boolean> {
    try {
      const filePath = join(this.uploadsPath, filename);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file info
   */
  async getFileInfo(filename: string) {
    try {
      const filePath = join(this.uploadsPath, filename);
      const stats = await fs.stat(filePath);
      return {
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        path: filePath,
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException(`File not found: ${filename}`);
      }
      throw error;
    }
  }

  /**
   * List all files in uploads directory
   */
  async listFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.uploadsPath);
      return files.filter(file => !file.startsWith('.')); // Filter out hidden files
    } catch (error) {
      this.logger.error('Error listing files:', error);
      return [];
    }
  }

  /**
   * Clean up old files (older than specified days)
   */
  async cleanupOldFiles(daysOld: number = 30): Promise<void> {
    try {
      const files = await this.listFiles();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      for (const filename of files) {
        const filePath = join(this.uploadsPath, filename);
        const stats = await fs.stat(filePath);
        
        if (stats.birthtime < cutoffDate) {
          await this.deleteFile(filename);
          this.logger.log(`Cleaned up old file: ${filename}`);
        }
      }
    } catch (error) {
      this.logger.error('Error during cleanup:', error);
    }
  }

  /**
   * Extract filename from URL
   */
  private extractFilenameFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
}