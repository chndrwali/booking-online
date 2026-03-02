"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────

export interface StepConfig {
  id: string;
  title: string;
  description?: string;
}

interface MultiStepFormContextValue {
  currentStep: number;
  totalSteps: number;
  goToNext: () => void;
  goToPrev: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  setCanGoNext: (val: boolean) => void;
}

const MultiStepFormContext =
  React.createContext<MultiStepFormContextValue | null>(null);

export function useMultiStepForm() {
  const ctx = React.useContext(MultiStepFormContext);
  if (!ctx)
    throw new Error(
      "useMultiStepForm must be used within <MultiStepFormProvider>",
    );
  return ctx;
}

// ─── Provider ───────────────────────────────────────────────

interface MultiStepFormProviderProps {
  steps: StepConfig[];
  children: React.ReactNode;
  onComplete?: () => void;
}

export function MultiStepFormProvider({
  steps,
  children,
  onComplete,
}: MultiStepFormProviderProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [canGoNext, setCanGoNext] = React.useState(true);

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const goToNext = React.useCallback(() => {
    if (isLastStep) {
      onComplete?.();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  }, [isLastStep, onComplete, totalSteps]);

  const goToPrev = React.useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = React.useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) setCurrentStep(step);
    },
    [totalSteps],
  );

  const value = React.useMemo(
    () => ({
      currentStep,
      totalSteps,
      goToNext,
      goToPrev,
      goToStep,
      isFirstStep,
      isLastStep,
      canGoNext,
      setCanGoNext,
    }),
    [
      currentStep,
      totalSteps,
      goToNext,
      goToPrev,
      goToStep,
      isFirstStep,
      isLastStep,
      canGoNext,
    ],
  );

  return (
    <MultiStepFormContext.Provider value={value}>
      {children}
    </MultiStepFormContext.Provider>
  );
}

// ─── Step Indicator ─────────────────────────────────────────

interface StepIndicatorProps {
  steps: StepConfig[];
  className?: string;
}

export function StepIndicator({ steps, className }: StepIndicatorProps) {
  const { currentStep } = useMultiStepForm();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-300",
                  isCompleted && "border-violet-500 bg-violet-500 text-white",
                  isCurrent && "border-violet-500 text-violet-500 scale-110",
                  !isCompleted &&
                    !isCurrent &&
                    "border-muted-foreground/30 text-muted-foreground/50",
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  "hidden text-sm font-medium md:block transition-colors",
                  isCurrent && "text-foreground",
                  !isCurrent && "text-muted-foreground",
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 md:w-12 rounded-full transition-colors duration-300",
                  isCompleted ? "bg-violet-500" : "bg-muted-foreground/20",
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Step Content ───────────────────────────────────────────

interface StepContentProps {
  stepIndex: number;
  children: React.ReactNode;
  className?: string;
}

export function StepContent({
  stepIndex,
  children,
  className,
}: StepContentProps) {
  const { currentStep } = useMultiStepForm();

  if (currentStep !== stepIndex) return null;

  return (
    <div
      className={cn(
        "animate-in fade-in-0 slide-in-from-right-4 duration-300",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── Step Navigation ────────────────────────────────────────

interface StepNavigationProps {
  onSubmit?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  className?: string;
}

export function StepNavigation({
  onSubmit,
  isSubmitting,
  submitLabel = "Selesai",
  className,
}: StepNavigationProps) {
  const { goToNext, goToPrev, isFirstStep, isLastStep, canGoNext } =
    useMultiStepForm();

  return (
    <div className={cn("flex items-center justify-between pt-6", className)}>
      <Button
        type="button"
        variant="ghost"
        onClick={goToPrev}
        disabled={isFirstStep}
        className={cn(isFirstStep && "invisible")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali
      </Button>
      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!canGoNext || isSubmitting}
          className="bg-linear-to-r from-violet-600 to-indigo-600 text-white min-w-[140px]"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Menyimpan...
            </span>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              {submitLabel}
            </>
          )}
        </Button>
      ) : (
        <Button type="button" onClick={goToNext} disabled={!canGoNext}>
          Lanjut
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
