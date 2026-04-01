export type TranslatorKey =
  | 'CANONICAL'
  | 'JAVASCRIPT'
  | 'PYTHON'
  | 'GO'
  | 'DOTNET'
  | 'JAVA'
  | 'GROOVY'
  | 'ANONYMIZED';

export const TRANSLATOR_KEYS: TranslatorKey[] = [
  'CANONICAL',
  'JAVASCRIPT',
  'PYTHON',
  'GO',
  'DOTNET',
  'JAVA',
  'GROOVY',
  'ANONYMIZED',
];

export const TRANSLATOR_DISPLAY_NAMES: Record<TranslatorKey, string> = {
  CANONICAL: 'Canonical',
  JAVASCRIPT: 'JavaScript',
  PYTHON: 'Python',
  GO: 'Go',
  DOTNET: '.NET',
  JAVA: 'Java',
  GROOVY: 'Groovy',
  ANONYMIZED: 'Anonymized',
};

export type Translations = Record<TranslatorKey, string>;

export interface State {
  queryInput: string;
  translations: Translations;
  error: string | null;
}
