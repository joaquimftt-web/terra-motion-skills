export const motionTokens = {
  duration: {
    buttonFeedback: 140,
    accordionTransition: 180,
  },
  easing: {
    standard: [0.2, 0, 0, 1],
  },
} as const;

export type MotionDurationToken = keyof typeof motionTokens.duration;
export type MotionEasingToken = keyof typeof motionTokens.easing;
