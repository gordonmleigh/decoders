'use client';
import { SiteMeta } from '@/util/metadata';
import clsx from 'clsx';
import Link from 'next/link';
import { ReactNode } from 'react';
import { DarkModeSwitch } from './DarkModeSwitch';
import { Invertocat } from './Invertocat';
import { Logo } from './Logo';
import { MenuButton } from './MenuButton';

export interface TopNavProps {
  menuOpen?: boolean;
  onMenuClick?: () => void;
  sections?: ReactNode;
}

export function TopNav({
  menuOpen,
  onMenuClick,
  sections,
}: TopNavProps): JSX.Element {
  return (
    <div
      className={clsx(
        'fixed top-0 inset-0 z-50 flex h-14 items-center justify-between border-b border-solid border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 lg:shadow-none xl:left-80',
      )}
    >
      <div className="flex items-center gap-5 lg:hidden">
        <MenuButton onClick={onMenuClick} open={menuOpen} />
        <Link href="/" aria-label="Home">
          <Logo className="h-6" />
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <nav className="hidden md:block">
          <ul role="list" className="flex items-center gap-8">
            {sections}
          </ul>
        </nav>
      </div>
      <div className="grow" />
      <div className="flex gap-4">
        <DarkModeSwitch />
        <a
          href={SiteMeta.repo}
          className="flex gap-2 items-center transition text-zinc-600 hover:text-zinc-900 text-sm dark:text-zinc-400 dark:hover:text-white"
        >
          <Invertocat className="h-5" />
          <span className="hidden md:inline">GitHub</span>
        </a>
      </div>
    </div>
  );
}
