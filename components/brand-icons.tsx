type BrandIconProps = { size?: number | string; className?: string };

export function GitHubIcon({ size = 18, className }: BrandIconProps) {
  return <svg aria-hidden="true" className={className} fill="currentColor" height={size} viewBox="0 0 24 24" width={size}><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" /></svg>;
}

export function LinkedInIcon({ size = 18, className }: BrandIconProps) {
  return <svg aria-hidden="true" className={className} fill="currentColor" height={size} viewBox="0 0 24 24" width={size}><path d="M5.16 3.5A2.16 2.16 0 1 1 .84 3.5a2.16 2.16 0 0 1 4.32 0ZM1.08 8.18h4.16V22H1.08V8.18Zm6.76 0h3.99v1.89h.06c.56-1.08 1.92-2.22 3.96-2.22 4.24 0 5.02 2.79 5.02 6.42V22h-4.15v-6.84c0-1.63-.03-3.72-2.27-3.72-2.27 0-2.62 1.77-2.62 3.6V22H7.84V8.18Z" /></svg>;
}

export function LeetCodeIcon({ size = 18, className }: BrandIconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height={size} viewBox="0 0 24 24" width={size}><path d="M9.4 3.2c-3.1 2.4-4.7 6.2-4.1 10.1.6 4 3.5 6.9 7.4 7.5 2.7.4 5.4-.4 7.3-2.3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d="M13.1 3.1 8.2 8.2l5.2 5.2h6.1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
}
