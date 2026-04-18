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
        "block shrink-0 object-contain",
        iconOnly ? "h-10 w-auto" : "h-auto w-[88px] sm:w-[112px] md:w-[132px]",
        className,
      )}
    />
  );
}
