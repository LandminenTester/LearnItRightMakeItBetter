// Stabile, maschinenlesbare Fehlercodes für Problem-Details-Antworten
// (docs/api/01-api-conventions.md §3). Die UI übersetzt anhand dieser Codes.
export const ERROR_CODES = [
  'validation_failed',
  'unauthenticated',
  'account_inactive',
  'permission_denied',
  'mfa_required',
  'reauth_required',
  'csrf_failed',
  'not_found',
  'module_disabled',
  'version_conflict',
  'conflict',
  'rate_limited',
  'quota_exceeded',
  'file_too_large',
  'unsupported_media_type',
  'dimensions_exceeded',
  'search_unavailable',
  'internal_error',
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

/** Problem-Details-Grundform (RFC 9457) — vollständige Zod-Schemas folgen mit den DTOs. */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  code: ErrorCode;
  detail?: string;
  requestId?: string;
  errors?: Array<{ path: string; code: string; message: string }>;
}
