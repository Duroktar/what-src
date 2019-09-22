
declare namespace ReactCountUp {
  type UseCountUpHookProps = {
    start: number
    end: number
    delay: number
    duration: number
    formattingFn: (value: number) => string
    onReset: () => void
    onUpdate: () => void
    onPauseResume: () => void
    onStart: (args: { pauseResume: Function }) => void
    onEnd: (args: { pauseResume: Function }) => void
  };

  type UseCountUpHookState = {
    countUp: number
    start: () => void
    pauseResume: () => void
    reset: () => void
    update: (newEnd?: number) => void
  };

  function useCountUp(params: Partial<UseCountUpHookProps>): UseCountUpHookState
}
