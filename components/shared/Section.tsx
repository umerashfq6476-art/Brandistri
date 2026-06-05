import { cn } from "@/lib/utils";

export default function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", className)}>
      <div className="container max-w-6xl">{children}</div>
    </section>
  );
}
