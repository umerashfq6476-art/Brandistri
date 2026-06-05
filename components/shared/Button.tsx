import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";

type BaseProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

type AsButton = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type AsLink = BaseProps & { href: string };

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors";

const variants: Record<Variant, string> = {
  primary: "bg-accent-primary text-white hover:bg-accent-primary/90",
  ghost: "border border-border text-text-primary hover:bg-surface",
};

export default function Button(props: AsButton | AsLink) {
  const { variant = "primary", className, children } = props;
  const classes = cn(base, variants[variant], className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, className: _c, children: _ch, ...rest } = props as AsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
