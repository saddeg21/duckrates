import type { CSSProperties } from "react";

const NOT_FOUND_ASSET = "/assets/not-found.svg";

type NotFoundSceneProps = {
  className?: string;
  color?: string;
};

export function NotFoundScene({
  className,
  color = "#CF5C36",
}: NotFoundSceneProps) {
  const maskStyle = {
    backgroundColor: color,
    WebkitMask: `url("${NOT_FOUND_ASSET}") center / contain no-repeat`,
    mask: `url("${NOT_FOUND_ASSET}") center / contain no-repeat`,
  } satisfies CSSProperties;

  return (
    <div
      className={`w-full overflow-hidden select-none${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <div
        className="mx-auto w-full aspect-[1684/2528]"
        style={maskStyle}
      />
    </div>
  );
}
