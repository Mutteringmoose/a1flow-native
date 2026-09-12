import { tokens, type Tokens } from '@/theme/tokens';

/**
 * The app is dark-only by doctrine (§2, Principle 6), so there is no scheme to
 * read and no provider to mount — this returns one frozen object with a stable
 * identity, which means it is safe in a dependency array.
 *
 * It exists as a hook rather than a bare import so that call sites do not have
 * to change if a theme ever becomes runtime-selectable.
 */
export function useTheme(): Tokens {
  return tokens;
}
