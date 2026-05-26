export const clerkAppearance = {
  variables: {
    colorPrimary: 'var(--color-gold-500)',
    colorBackground: 'var(--color-bg-base)',
    colorText: 'var(--color-text-primary)',
    colorTextSecondary: 'var(--color-text-secondary)',
    colorInputBackground: 'var(--color-bg-muted)',
    colorInputText: 'var(--color-text-primary)',
    colorDanger: 'var(--color-error)',
    borderRadius: '0.5rem',
    fontFamily: 'inherit',
  },
  elements: {
    rootBox: 'mx-auto',
    card: 'bg-bg-card border border-border-default shadow-gold',
    headerTitle: 'text-text-primary font-display',
    headerSubtitle: 'text-text-secondary',
    formButtonPrimary: 'bg-gold-500 hover:bg-gold-400 text-text-inverted font-semibold normal-case',
    formFieldInput: 'bg-bg-muted border-border-default text-text-primary',
    footerActionLink: 'text-gold-500 hover:text-gold-400',
    socialButtonsBlockButton: {
      backgroundColor: 'var(--color-bg-muted)',
      borderColor: 'var(--color-border-strong)',
      color: 'var(--color-text-primary)',
    },
    socialButtonsBlockButtonText: {
      color: 'var(--color-text-primary)',
    },
    socialButtonsIconButton: {
      backgroundColor: 'var(--color-bg-muted)',
      borderColor: 'var(--color-border-strong)',
      color: 'var(--color-text-primary)',
    },
    dividerLine: 'bg-border-default',
    dividerText: 'text-text-secondary',
  },
};
