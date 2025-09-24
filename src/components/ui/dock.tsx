"use client";

import * as React from "react";
import { useRef } from "react";

import { cn } from "../../lib/utils";

interface DockProps {
  className?: string;
  children: React.ReactNode;
  maxAdditionalSize?: number;
  iconSize?: number;
}

interface DockIconProps {
  className?: string;
  src?: string;
  href: string;
  name: string;
  handleIconHover?: (e: React.MouseEvent<HTMLLIElement>) => void;
  children?: React.ReactNode;
  iconSize?: number;
}

type ScaleValueParams = [number, number];

export const scaleValue = function (
  value: number,
  from: ScaleValueParams,
  to: ScaleValueParams
): number {
  const scale = (to[1] - to[0]) / (from[1] - from[0]);
  const capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
  return Math.floor(capped * scale + to[0]);
};

export function DockIcon({
  className,
  src,
  href,
  name,
  handleIconHover,
  children,
  iconSize,
}: DockIconProps) {
  const ref = useRef<HTMLLIElement | null>(null);

  return (
    <>
      <style>{`
          .icon:hover {
            width: calc(var(--icon-size) * 1.5);
            height: calc(var(--icon-size) * 1.5);
            margin-top: calc(var(--icon-size) * -0.5);
            transform: translateY(-8px) scale(1.06);
          }
          .icon:hover + .icon {
            width: calc(
              var(--icon-size) * 1.33 + var(--dock-offset-right, 0px)
            );
            height: calc(
              var(--icon-size) * 1.33 + var(--dock-offset-right, 0px)
            );
            margin-top: calc(
              var(--icon-size) * -0.33 + var(--dock-offset-right, 0) * -1
            );
          }

          .icon:hover + .icon + .icon {
            width: calc(
              var(--icon-size) * 1.17 + var(--dock-offset-right, 0px)
            );
            height: calc(
              var(--icon-size) * 1.17 + var(--dock-offset-right, 0px)
            );
            margin-top: calc(
              var(--icon-size) * -0.17 + var(--dock-offset-right, 0) * -1
            );
          }

          .icon:has(+ .icon:hover) {
            width: calc(var(--icon-size) * 1.33 + var(--dock-offset-left, 0px));
            height: calc(
              var(--icon-size) * 1.33 + var(--dock-offset-left, 0px)
            );
            margin-top: calc(
              var(--icon-size) * -0.33 + var(--dock-offset-left, 0) * -1
            );
          }

          .icon:has(+ .icon + .icon:hover) {
            width: calc(var(--icon-size) * 1.17 + var(--dock-offset-left, 0px));
            height: calc(
              var(--icon-size) * 1.17 + var(--dock-offset-left, 0px)
            );
            margin-top: calc(
              var(--icon-size) * -0.17 + var(--dock-offset-left, 0) * -1
            );
          }

          /* Smooth transform */
          li.icon { will-change: transform, width, height, margin-top; }

          /* Show tooltip on hover */
          li.icon:hover .tooltip { opacity: 1; }

          /* Fallback: animate anchor/image directly to avoid utility conflicts */
          ul.dock-list { position: relative; z-index: 40; pointer-events: auto; }
          ul.dock-list li.icon { pointer-events: auto; }
          ul.dock-list li.icon a { transition: transform 180ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 180ms; will-change: transform; }
          ul.dock-list li.icon:hover a { transform: translateY(-8px) scale(1.08) !important; box-shadow: 0 12px 24px rgba(0,0,0,.35) !important; outline: 2px solid rgba(255,255,255,.08); }
        `}</style>
      <li
        ref={ref}
        style={{
          transition:
            "width, height, margin-top, transform, cubic-bezier(0.25, 1, 0.5, 1) 160ms",
          // @ts-expect-error css var typing
          "--icon-size": `${iconSize}px`,
        }}
        onMouseMove={handleIconHover}
        className={cn(
          "icon relative z-20 flex h-[var(--icon-size)] w-[var(--icon-size)] cursor-pointer items-center justify-center px-[calc(var(--icon-size)*0.075)] hover:-mt-[calc(var(--icon-size)/2)] hover:h-[calc(var(--icon-size)*1.5)] hover:w-[calc(var(--icon-size)*1.5)] [&_img]:object-contain",
          className
        )}
      >
        <a
          href={href}
          className="relative z-20 aspect-square w-full overflow-visible rounded-[10px] border border-gray-100 bg-gradient-to-t from-neutral-100 to-white p-1.5 shadow-[rgba(0,_0,_0,_0.05)_0px_1px_0px_inset] after:absolute after:inset-0 after:rounded-[inherit] after:shadow-md after:shadow-zinc-800/10 dark:border-zinc-900 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[rgba(255,_255,_255,_0.3)_0px_1px_0px_inset]"
        >
          <span className="tooltip pointer-events-none absolute top-[-40px] left-1/2 -translate-x-1/2 rounded-md border border-gray-100 bg-gradient-to-t from-neutral-100 to-white p-1 px-2 text-xs whitespace-nowrap text-black opacity-0 transition-opacity duration-200 z-10 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:text-white">
            {name}
          </span>
          {src ? (
            <img src={src} alt={name} className="h-full w-full rounded-[inherit]" />
          ) : (
            children
          )}
        </a>
      </li>
    </>
  );
}

export function Dock({
  className,
  children,
  maxAdditionalSize = 5,
  iconSize = 55,
}: DockProps) {
  const dockRef = useRef<HTMLDivElement | null>(null);

  const handleIconHover = (e: React.MouseEvent<HTMLLIElement>) => {
    if (!dockRef.current) return;
    const mousePos = e.clientX;
    const iconPosLeft = e.currentTarget.getBoundingClientRect().left;
    const iconWidth = e.currentTarget.getBoundingClientRect().width;

    const cursorDistance = (mousePos - iconPosLeft) / iconWidth;
    const offsetPixels = scaleValue(
      cursorDistance,
      [0, 1],
      [maxAdditionalSize * -1, maxAdditionalSize]
    );

    dockRef.current.style.setProperty(
      "--dock-offset-left",
      `${offsetPixels * -1}px`
    );
    dockRef.current.style.setProperty("--dock-offset-right", `${offsetPixels}px`);
  };

  return (
    <nav ref={dockRef} role="navigation" aria-label="Main Dock" className="relative z-[50] pointer-events-auto">
      <ul
        className={cn(
          "dock-list flex items-center overflow-visible rounded-xl border border-gray-100 bg-gradient-to-t from-neutral-50 to-white p-1 dark:border-zinc-900 dark:from-zinc-950 dark:to-zinc-900",
          className
        )}
      >
        {React.Children.map(children, (child) =>
          React.isValidElement<DockIconProps>(child)
            ? React.cloneElement(child as React.ReactElement<DockIconProps>, {
                handleIconHover,
                iconSize,
              })
            : child
        )}
      </ul>
    </nav>
  );
}


