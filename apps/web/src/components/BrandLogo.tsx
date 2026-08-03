import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  onClick?: () => void;
  /** lockup = mark + wordmark; mark = icon only */
  variant?: "lockup" | "mark";
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  href = "/",
  onClick,
  variant = "lockup",
  className = "",
  priority = false,
}: BrandLogoProps) {
  const isMark = variant === "mark";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex shrink-0 items-center ${className}`}
      aria-label="Deskzy home"
    >
      <Image
        src={isMark ? "/logo-mark.png" : "/logo.png"}
        alt="Deskzy"
        width={isMark ? 36 : 148}
        height={isMark ? 36 : 36}
        priority={priority}
        className={
          isMark
            ? "h-8 w-8 object-contain dark:brightness-[1.55] dark:saturate-[1.15]"
            : "h-7 w-auto object-contain object-left dark:brightness-[1.55] dark:saturate-[1.15] md:h-8"
        }
      />
    </Link>
  );
}
