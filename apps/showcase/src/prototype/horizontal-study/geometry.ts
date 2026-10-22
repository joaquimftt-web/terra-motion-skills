export function linkedGeometry(
  width: number,
  height: number,
  contentHeight: number,
  viewWidth: number,
  railWidth: number,
  reduced: boolean,
) {
  const travel = Math.max(0, railWidth - viewWidth);
  return {
    linked:
      !reduced && width >= 1000 && height >= 720 && contentHeight <= height - 48 && travel > 1,
    travel,
  };
}
export function positionFraction(position: number, travel: number) {
  return travel > 0 ? Math.max(0, Math.min(1, position / travel)) : 0;
}
