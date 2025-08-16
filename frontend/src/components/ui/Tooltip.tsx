import { ReactNode, useId } from "react";

type Props = {
  content: ReactNode;
  children: ReactNode;         // usually a small icon/button
  className?: string;
};

export default function Tooltip({ content, children, className }: Props) {
  const id = useId();
  return (
    <span className={`relative inline-flex items-center group ${className ?? ""}`}>
      {/* trigger */}
      <span aria-describedby={id} className="inline-flex">{children}</span>

      {/* bubble */}
      <span
        role="tooltip"
        id={id}
        className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 -translate-y-2
                   whitespace-pre-line rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-white opacity-0 shadow
                   transition group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {content}
      </span>
    </span>
  );
}
