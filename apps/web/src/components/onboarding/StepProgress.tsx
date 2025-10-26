/**
 * StepProgress Component
 * Displays a progress indicator for multi-step forms
 */

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function StepProgress({ currentStep, totalSteps, className = '' }: StepProgressProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold text-foreground'>
          Step {currentStep} of {totalSteps}
        </h2>
        <span className='text-sm text-muted-foreground'>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
      </div>

      {/* Progress Bar */}
      <div className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
        <div
          className='h-full bg-blue-500 transition-all duration-300 ease-out'
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          role='progressbar'
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
        />
      </div>

      {/* Step Indicators */}
      <div className='flex justify-between mt-3'>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`flex flex-col items-center flex-1 ${index < currentStep - 1 ? 'opacity-100' : 'opacity-30'}`}
          >
            <div
              className={`w-2 h-2 rounded-full transition-all ${
                index < currentStep - 1
                  ? 'bg-blue-500 dark:bg-blue-400'
                  : index === currentStep - 1
                    ? 'bg-blue-500 dark:bg-blue-400 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Step ${index + 1}`}
            />
            <span
              className={`text-xs mt-1 ${
                index === currentStep - 1 ? 'font-semibold text-blue-500 dark:text-blue-400' : 'text-muted-foreground'
              }`}
            >
              {index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
