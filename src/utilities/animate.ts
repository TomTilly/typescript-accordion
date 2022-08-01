/**
 *
 * @param draw Drawing function
 * @param duration In milliseconds
 * @param timing Easing function
 * @returns Promise<void>
 */
function animate(
  draw: (progress: number) => void,
  duration = 200,
  timing = (timeFraction: number) => timeFraction
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const start = performance.now();

      requestAnimationFrame(function drawNextFrame(
        time: number
      ): number | void {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;
        const progress = timing(timeFraction);
        draw(progress);

        if (timeFraction < 1) {
          return requestAnimationFrame(drawNextFrame);
        }
        resolve();
      });
    } catch {
      reject();
    }
  });
}

export default animate;
