import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nPath } from '../../generated/i18n.generated';

export function typedI18nValidationMessage(
  key: I18nPath,
  args?: Record<string, any>,
) {
  return i18nValidationMessage(key, args);
}
