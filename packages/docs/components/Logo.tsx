import { SiteMeta } from '@/util/metadata.js';
import clsx from 'clsx';

export interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps): JSX.Element {
  return (
    <div className={clsx(className, 'flex content-center gap-2')}>
      <img alt="logo" src={`${SiteMeta.basePath}/icon-256.png`} />
      <div className="dark:text-white">{SiteMeta.title}</div>
    </div>
  );
}
