/**
 * Position/size styles for floor illustrations per metric and context.
 * Uses inline CSS properties instead of utility classes (avoids UnoCSS purge issues).
 * Each metric has a 'choice' and 'vote' entry with styles for options A and B.
 */

interface FloorPosition {
  a: Record<string, string>
  b: Record<string, string>
}

interface FloorPositions {
  choice: FloorPosition
  vote: FloorPosition
}

export const FLOOR_POSITIONS: Record<string, FloorPositions> = {
  cls: {
    choice: {
      a: { top: '59%', left: '13%', transform: 'rotate(-13deg)', width: '24%' },
      b: { top: '57%', right: '11.5%', transform: 'rotate(14deg)', width: '24%' },
    },
    vote: {
      a: { top: '8%', left: '1%', transform: 'rotate(-22deg)', width: '10%' },
      b: { top: '7%', right: '3%', transform: 'rotate(24deg)', width: '10%' },
     },
  },
  fcp: {
    choice: {
      a: { top: '62%', left: '13%', transform: 'rotate(-14deg)', width: '24%' },
      b: { top: '65%', right: '11%', transform: 'rotate(14deg)', width: '26%' },
    },
    vote: {
      a: { top: '10%', left: '0.5%', transform: 'rotate(-23deg)', width: '12%' },
      b: { top: '10%', right: '1.5%', transform: 'rotate(24deg)', width: '13%' },
     },
  },
  lcp: {
    choice: {
      a: { top: '61%', left: '15%', transform: 'rotate(-13deg)', width: '20%' },
      b: { top: '52%', right: '12%', transform: 'rotate(14deg)', width: '22%' },
    },
    vote: {
      a: { top: '6%', left: '1.5%', transform: 'rotate(-23deg)', width: '9%' },
      b: { top: '6%', right: '3%', transform: 'rotate(24deg)', width: '10%' },
     },
  },
  tbt: {
    choice: {
      a: { top: '56%', left: '16%', transform: 'rotate(-14deg)', width: '16%' },
      b: { top: '55%', right: '16%', transform: 'rotate(14deg)', width: '16%' },
    },
    vote: {
      a: { top: '5.5%', left: '2.5%', transform: 'rotate(-23deg)', width: '7%' },
      b: { top: '5%', right: '4%', transform: 'rotate(24deg)', width: '7%' },
     },
  },
  si: {
    choice: {
      a: { top: '63%', left: '10.5%', transform: 'rotate(-14deg)', width: '28%' },
      b: { top: '62%', right: '12%', transform: 'rotate(14deg)', width: '24%' },
    },
    vote: {
      a: { top: '10%', left: '-1%', transform: 'rotate(-22deg)', width: '14%' },
      b: { top: '8%', right: '1.5%', transform: 'rotate(24deg)', width: '12%' },
     },
  },
}
