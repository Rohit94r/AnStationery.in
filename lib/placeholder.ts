type PlaceholderOpts = {
  emoji?: string;
  label?: string;
  from?: string;
  to?: string;
};

export function placeholderImage({
  emoji = "\u270f\ufe0f",
  label = "",
  from = "#fff3c4",
  to = "#ffd9e6",
}: PlaceholderOpts = {}): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='${from}'/>
      <stop offset='1' stop-color='${to}'/>
    </linearGradient>
    <pattern id='dots' width='40' height='40' patternUnits='userSpaceOnUse'>
      <circle cx='20' cy='20' r='3' fill='rgba(255,255,255,0.55)'/>
    </pattern>
  </defs>
  <rect width='800' height='800' fill='url(#g)'/>
  <rect width='800' height='800' fill='url(#dots)'/>
  <text x='400' y='430' font-size='240' text-anchor='middle' dominant-baseline='central'>${emoji}</text>
  <text x='400' y='640' font-size='40' font-family='sans-serif' font-weight='700' fill='rgba(26,26,26,0.55)' text-anchor='middle'>${label}</text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
