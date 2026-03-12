import { BodyText, HeroHeading, SectionHeading } from './Typography';
import styles from './HeroText.module.css';

export function HeroText() {
  return (
    <div className={styles.content}>
      <SectionHeading>Hi there!</SectionHeading>
      <HeroHeading>What would you like to know?</HeroHeading>
      <BodyText className={styles.description}>
        Use one of the most common prompts below
        <br />
        or ask your own question
      </BodyText>
    </div>
  );
}
