import type { ComponentPropsWithoutRef } from "react";

export type CardProps = ComponentPropsWithoutRef<"div"> & {
  size?: "sm" | "sm2" | "md" | "lg" | "xl";
  variant?: "default" | "premium" | "free";
};