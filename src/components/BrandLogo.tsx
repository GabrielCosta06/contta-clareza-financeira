import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  iconOnly?: boolean;
  inverted?: boolean;
};

export function BrandLogo({ className, iconOnly = false, inverted = false }: BrandLogoProps) {
  const src = inverted ? "/branding/logo-light.svg" : "/branding/logo-dark-bg.svg";
  const alt = iconOnly ? "Contta" : "Contta logo";

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        "block h-auto w-auto shrink-0",
        iconOnly ? "h-9" : "h-8 md:h-9",
        className,
      )}
    />
  );
}
