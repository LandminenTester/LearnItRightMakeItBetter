import { Controller, Get } from '@nestjs/common';

/**
 * Health-/Readiness-Endpoints (FR-PLAT-005, NFR-014).
 * /healthz: Prozess lebt — keine Abhängigkeitsprüfung (Container-Restart-Signal).
 * /readyz: prüft ab Phase 1 PostgreSQL/Redis hart und meldet degradierbare Dienste.
 */
@Controller()
export class HealthController {
  @Get('healthz')
  health(): { status: 'ok' } {
    return { status: 'ok' };
  }

  @Get('readyz')
  ready(): { status: 'ok'; dependencies: Record<string, string> } {
    // TODO(Phase 1): echte Dependency-Checks (PG/Redis hart; Meili/SMTP/Storage degradierbar)
    return { status: 'ok', dependencies: {} };
  }
}
