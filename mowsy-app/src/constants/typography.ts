export const typography = {
  fonts: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold'
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6
  }
};

export const textStyles = {
  h1: {
    fontSize: typography.sizes.xxxl,
    fontFamily: typography.fonts.bold,
    lineHeight: typography.lineHeights.tight
  },
  h2: {
    fontSize: typography.sizes.xxl,
    fontFamily: typography.fonts.bold,
    lineHeight: typography.lineHeights.tight
  },
  h3: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fonts.semiBold,
    lineHeight: typography.lineHeights.normal
  },
  h4: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.semiBold,
    lineHeight: typography.lineHeights.normal
  },
  body: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.regular,
    lineHeight: typography.lineHeights.normal
  },
  bodySmall: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    lineHeight: typography.lineHeights.normal
  },
  caption: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    lineHeight: typography.lineHeights.normal
  },
  button: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.semiBold,
    lineHeight: typography.lineHeights.tight
  }
};