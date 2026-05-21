import type { CSSProperties } from "react";

const ATOM_ASSET = "/assets/atom.svg";

type TechSceneProps = {
  className?: string;
  color?: string;
};

export function TechScene({
  className,
  color = "#CF5C36",
}: TechSceneProps) {
  const maskStyle = {
    backgroundColor: color,
    WebkitMask: `url("${ATOM_ASSET}") center / contain no-repeat`,
    mask: `url("${ATOM_ASSET}") center / contain no-repeat`,
  } satisfies CSSProperties;

  return (
    <div
      className={`w-full overflow-hidden select-none${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <div
        className="mx-auto h-[220px] w-full max-w-[714px] sm:h-[280px] md:h-[340px]"
        style={maskStyle}
      />
    </div>
  );
}
