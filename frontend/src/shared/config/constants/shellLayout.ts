export const SHELL_LAYOUT_MODES = ['desktop', 'mobile'] as const

export type ShellLayoutMode = (typeof SHELL_LAYOUT_MODES)[number]

/** Viewport widths at or below this value use the mobile shell. */
export const SHELL_LAYOUT_MOBILE_MAX_WIDTH = 768
