export interface PersistedStateProps {
  getItem?: (key: string) => unknown;
  setItem?: (key: string, value: unknown) => void;
}
