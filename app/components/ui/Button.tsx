import React from "react"

type ButtonProps = {
  variant?: "primary" | "ghost" | "danger"
  size?: "md" | "sm" | "icon"
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const classes: Record<string, Record<string, string>> = {
  primary: {
    _: "rounded-2xl hover:rounded-xl transition-all cursor-pointer bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover",
  },
  ghost: {
    md: "cursor-pointer px-4 py-2 text-sm text-secondary transition-colors hover:text-primary",
    sm: "cursor-pointer rounded px-3 py-1 text-sm text-secondary transition-colors hover:text-primary",
    icon: "cursor-pointer rounded p-1 text-xs text-muted transition-colors hover:text-primary",
  },
  danger: {
    sm: "cursor-pointer rounded px-3 py-1 text-sm text-danger transition-colors hover:text-danger-hover",
    icon: "cursor-pointer rounded p-1 text-xs text-muted transition-colors hover:text-danger",
  },
}

export function Button({
  variant = "ghost",
  size = "sm",
  className,
  ...props
}: ButtonProps) {
  const variantClasses = classes[variant]
  const resolved = variantClasses["_"] ?? variantClasses[size] ?? ""
  return <button className={`${resolved}${className ? ` ${className}` : ""}`} {...props} />
}
