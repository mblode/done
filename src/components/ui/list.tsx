'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export const ListMenuContent = ({
  className,
  children,
}: {
  className?: string
  inset?: boolean
  children: React.ReactNode
}) => (
  <div
    className={cn(
      'min-w-[8rem] overflow-hidden rounded-md border bg-popover p-2 text-popover-foreground shadow-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
  >
    {children}
  </div>
)

export const ListMenuItem = ({
  className,
  inset,
  children,
  onClick,
}: {
  className?: string
  inset?: boolean
  children: React.ReactNode
  onClick?: () => void
}) => (
  <div
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      { 'pl-8': inset, 'cursor-pointer hover:bg-muted': !!onClick },
      className,
    )}
    onClick={() => onClick?.()}
  >
    {children}
  </div>
)

export const ListMenuLabel = ({
  className,
  inset,
  children,
}: {
  className?: string
  inset?: boolean
  children: React.ReactNode
}) => (
  <div
    className={cn(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className,
    )}
  >
    {children}
  </div>
)

export const ListMenuSeparator = ({ className }: { className?: string }) => (
  <div className={cn('mx-3 my-1 h-px bg-input', className)} />
)