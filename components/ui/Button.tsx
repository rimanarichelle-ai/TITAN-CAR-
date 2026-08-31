"use client";

import React, { useState, useRef } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "whatsapp"
  | "secondary"
  | "outline"
  | "ghost"
  | "pill"
  | "icon"
  | "destructive"
  | "success";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  active?: boolean;
  iconPosition?: "left" | "right";
  icon?: React.ReactNode;
  children?: React.ReactNode;
  enableRipple?: boolean;
}

interface RippleEffect {
  x: number;
  y: number;
  size: number;
  id: number;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      active = false,
      iconPosition = "left",
      icon,
      children,
      className = "",
      disabled,
      onClick,
      enableRipple = true,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<RippleEffect[]>([]);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!enableRipple || disabled || isLoading) return;

      const button = buttonRef.current || e.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const newRipple: RippleEffect = {
        x,
        y,
        size,
        id: Date.now(),
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      handleRipple(e);
      if (onClick) onClick(e);
    };

    // Variant Styles
    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-gradient-to-r from-[#EF4444] via-[#DC2626] to-[#991B1B] text-[#FFFFFF] font-extrabold border border-[#EF4444]/40 hover:border-[#EF4444] hover:shadow-[0_8px_25px_-4px_rgba(239,68,68,0.5)] hover:-translate-y-0.5 active:translate-y-[1px] active:scale-[0.98]",
      whatsapp:
        "bg-gradient-to-r from-[#25D366] to-[#128C7E] text-[#FFFFFF] font-extrabold border border-[#25D366]/40 hover:border-[#25D366] hover:shadow-[0_8px_25px_-4px_rgba(37,211,102,0.45)] hover:-translate-y-0.5 active:translate-y-[1px] active:scale-[0.98]",
      secondary:
        "bg-[#222222] hover:bg-[#2A2A2A] text-[#FFFFFF] font-extrabold border border-[#3A3A3A] hover:border-[#EF4444] hover:shadow-[0_6px_20px_-3px_rgba(0,0,0,0.6)] hover:-translate-y-0.5 active:translate-y-[1px] active:scale-[0.98]",
      outline:
        "bg-transparent hover:bg-[#222222] text-[#FFFFFF] font-bold border border-[#303030] hover:border-[#EF4444] hover:shadow-md hover:-translate-y-0.5 active:translate-y-[1px] active:scale-[0.98]",
      ghost:
        "bg-transparent hover:bg-[#222222] text-[#B0B0B0] hover:text-[#FFFFFF] font-bold border border-transparent hover:border-[#303030] active:scale-[0.97]",
      pill: active
        ? "bg-[#EF4444] text-[#FFFFFF] font-extrabold border border-[#EF4444] shadow-[0_4px_15px_-2px_rgba(239,68,68,0.5)] rounded-full hover:-translate-y-0.5 active:scale-[0.97]"
        : "bg-[#181818] hover:bg-[#222222] text-[#B0B0B0] hover:text-[#FFFFFF] font-semibold border border-[#303030] hover:border-[#EF4444] rounded-full hover:-translate-y-0.5 active:scale-[0.97]",
      icon: "p-2 rounded-[8px] bg-[#222222] hover:bg-[#2A2A2A] text-[#B0B0B0] hover:text-[#FFFFFF] border border-[#303030] hover:border-[#EF4444] hover:shadow-md hover:-translate-y-0.5 active:translate-y-[1px] active:scale-[0.95] min-w-[44px] min-h-[44px] flex items-center justify-center",
      destructive:
        "bg-[#B71C1C] hover:bg-[#D32F2F] text-[#FFFFFF] font-extrabold border border-red-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]",
      success:
        "bg-[#10B981] hover:bg-[#059669] text-[#FFFFFF] font-extrabold border border-emerald-600 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]",
    };

    // Size Styles
    const sizeStyles: Record<ButtonSize, string> = {
      xs: "h-7 px-2.5 text-[11px] rounded-[6px]",
      sm: "h-8 px-3 text-[12px] rounded-[6px]",
      md: "h-10 px-4 text-[13px] rounded-[8px]",
      lg: "h-12 px-6 text-[15px] rounded-[10px]",
      icon: "",
    };

    const combinedClassName = `
      relative overflow-hidden inline-flex items-center justify-center gap-2
      transition-all duration-200 ease-out select-none cursor-pointer
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]
      disabled:opacity-50 disabled:pointer-events-none disabled:transform-none disabled:shadow-none
      motion-reduce:transform-none motion-reduce:transition-none
      group
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${className}
    `.trim();

    return (
      <button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        disabled={disabled || isLoading}
        onClick={handleClick}
        className={combinedClassName}
        {...props}
      >
        {/* Ripple elements */}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute bg-white/25 rounded-full pointer-events-none animate-ripple"
            style={{
              top: r.y,
              left: r.x,
              width: r.size,
              height: r.size,
            }}
          />
        ))}

        {/* Loading Spinner */}
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
        )}

        {/* Left Icon */}
        {!isLoading && icon && iconPosition === "left" && (
          <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">
            {icon}
          </span>
        )}

        {/* Children text */}
        {children && <span>{children}</span>}

        {/* Right Icon */}
        {!isLoading && icon && iconPosition === "right" && (
          <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:scale-105">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
