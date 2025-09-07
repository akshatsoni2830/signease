// frontend/src/poses.js
export const POSES = {
  A: {
    thumb:  { mcp: 0.7, pip: 0.5, dip: 0.2 }, // thumb tucked
    index:  { mcp: 1.2, pip: 1.0, dip: 0.8 }, // curled
    middle: { mcp: 1.2, pip: 1.0, dip: 0.8 },
    ring:   { mcp: 1.2, pip: 1.0, dip: 0.8 },
    pinky:  { mcp: 1.2, pip: 1.0, dip: 0.8 },
  },
  B: {
    thumb:  { mcp: 0.2, pip: 0.1, dip: 0.0 },
    index:  { mcp: 0.0, pip: 0.0, dip: 0.0 }, // straight
    middle: { mcp: 0.0, pip: 0.0, dip: 0.0 },
    ring:   { mcp: 0.0, pip: 0.0, dip: 0.0 },
    pinky:  { mcp: 0.0, pip: 0.0, dip: 0.0 },
  },
  HELLO: {
    thumb:  { mcp: 0.3, pip: 0.1, dip: 0.0 },
    index:  { mcp: 0.2, pip: 0.0, dip: 0.0 },
    middle: { mcp: 0.2, pip: 0.0, dip: 0.0 },
    ring:   { mcp: 0.2, pip: 0.0, dip: 0.0 },
    pinky:  { mcp: 0.2, pip: 0.0, dip: 0.0 },
  },
};

export const DEFAULT_POSE = "HELLO";
