import styles from './Typography.module.css';

type TypographyProps = {
  children: React.ReactNode;
  className?: string;
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export function HeroHeading({ children, className }: TypographyProps) {
  return <h1 className={joinClassNames(styles.heroHeading, className)}>{children}</h1>;
}

export function SectionHeading({ children, className }: TypographyProps) {
  return <p className={joinClassNames(styles.sectionHeading, className)}>{children}</p>;
}

export function BodyText({ children, className }: TypographyProps) {
  return <p className={joinClassNames(styles.bodyText, className)}>{children}</p>;
}

export function UiText({ children, className }: TypographyProps) {
  return <span className={joinClassNames(styles.uiText, className)}>{children}</span>;
}

export function Subtext({ children, className }: TypographyProps) {
  return <span className={joinClassNames(styles.subtext, className)}>{children}</span>;
}
