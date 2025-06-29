import type { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  tooltipText: string;
}

export function Tooltip({ children, tooltipText }: TooltipProps) {

  return (
    <div className="relative inline-block">
      <div className="group inline-flex items-center">
        {children}
        <div
          className={`absolute w-56 left-1/2 bottom-full mb-2 transform -translate-x-1/2 px-3 py-2
          text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100
          transition-opacity duration-700 z-[9999] pointer-events-none`}
        >
          {tooltipText}
        </div>
      </div>
    </div>
  )
}
