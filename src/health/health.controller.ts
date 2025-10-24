import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

/**
 * HealthController
 *
 * Controller responsável pelos health checks da aplicação.
 * Verifica status do banco de dados, memória e disco.
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  /**
   * GET /health
   * Health check geral da aplicação
   */
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check geral' })
  @ApiResponse({
    status: 200,
    description: 'Aplicação está saudável',
  })
  @ApiResponse({
    status: 503,
    description: 'Aplicação com problemas',
  })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024), // 150MB
    ]);
  }

  /**
   * GET /health/db
   * Health check específico do banco de dados
   */
  @Get('db')
  @HealthCheck()
  @ApiOperation({ summary: 'Health check do banco de dados' })
  @ApiResponse({
    status: 200,
    description: 'Banco de dados está saudável',
  })
  checkDatabase() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  /**
   * GET /health/memory
   * Health check de memória
   */
  @Get('memory')
  @HealthCheck()
  @ApiOperation({ summary: 'Health check de memória' })
  @ApiResponse({
    status: 200,
    description: 'Memória está saudável',
  })
  checkMemory() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }
}
