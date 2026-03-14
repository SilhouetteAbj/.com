import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);


function getBreatheDelayClass() {
  // Randomly assign a delay class for organic effect
  const delays = ["breathe-delay-1", "breathe-delay-2", "breathe-delay-3", "breathe-delay-4", "breathe-delay-5"];
  return delays[Math.floor(Math.random() * delays.length)];
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  // Add breathe animation to all primary/CTA buttons
  const isPrimary = !variant || variant === "default";
  const breatheClass = isPrimary ? `breathe ${getBreatheDelayClass()}` : "";

  // Heartbeat on hover for primary/CTA
  const [isHeartbeat, setHeartbeat] = React.useState(false);
  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isPrimary) setHeartbeat(true);
    if (props.onMouseEnter) props.onMouseEnter(e);
  };
  const handleAnimationEnd = () => setHeartbeat(false);

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }), breatheClass, isHeartbeat && "heartbeat")}
      onMouseEnter={handleMouseEnter}
      onAnimationEnd={handleAnimationEnd}
      {...props}
    />
  );
}

export { Button, buttonVariants };
