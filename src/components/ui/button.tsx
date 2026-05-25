"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white hover:bg-primary-hover",
        default:
          "bg-primary text-white hover:bg-primary-hover",
        secondary:
          "bg-secondary text-white hover:opacity-90",
        outline:
          "border border-primary bg-white text-primary hover:bg-muted hover:text-primary-hover",
        ghost:
          "bg-transparent text-primary hover:bg-muted",
        destructive:
          "bg-destructive text-white hover:opacity-90",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 text-sm",
        xs: "h-7 px-3 text-xs",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-10 p-0",
        "icon-sm": "size-8 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
