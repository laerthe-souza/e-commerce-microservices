import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus';

import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly healthCheck: HealthCheckService,
    private readonly memoryHealth: MemoryHealthIndicator,
    private readonly diskHealth: DiskHealthIndicator,
    private readonly prismaHealth: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.healthCheck.check([
      () => this.prismaHealth.pingCheck('PrismaClient', this.prismaService),
      () => this.memoryHealth.checkHeap('MemoryHeap', 200 * 1024 * 1024),
      () => this.memoryHealth.checkRSS('MemoryRSS', 3000 * 1024 * 1024),
      () =>
        this.diskHealth.checkStorage('DiskStorage', {
          path: '/',
          thresholdPercent: 0.5,
        }),
    ]);
  }
}
