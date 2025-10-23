// themeHelpers.ts
import { Theme } from './theme';

export const getImageStyle = (theme: Theme, size: 'small' | 'medium' | 'large') => ({
  width: theme.Image[size].width,
  height: theme.Image[size].height,
  borderRadius: theme.Image[size].borderRadius,
  resizeMode: theme.Image[size].resizeMode,
});
