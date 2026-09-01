/**
 * Section scrolling that survives `content-visibility: auto`.
 *
 * Every section carries `.cv-auto`, so off-screen sections are only *estimated*
 * at `contain-intrinsic-size: 900px` and are not measured until they approach
 * the viewport. Jumping to a far section therefore aims at a target computed
 * from estimates: as the intermediate sections render for real the document
 * grows underneath the animation and the scroll lands short - which is why
 * Contact (the last section) was unreachable.
 *
 * Fix: after the browser's smooth scroll settles, re-measure and re-aim. We
 * only correct once motion has stopped, otherwise each re-issued `scrollTo`
 * would restart the animation every frame and the scroll would look like a jump.
 */

/** Height of the fixed navbar; sections stop just below it. */
export const NAV_OFFSET = 80;

const maxScroll = () =>
  Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

/** Desired scrollY that puts `el` just under the navbar, clamped to the page. */
function targetFor(el: HTMLElement): number {
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  return Math.max(0, Math.min(top, maxScroll()));
}

export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;

  window.scrollTo({ top: targetFor(el), behavior: "smooth" });

  let lastY = -1;
  let stillFrames = 0;
  let frames = 0;

  const settle = () => {
    frames++;

    if (window.scrollY === lastY) stillFrames++;
    else {
      stillFrames = 0;
      lastY = window.scrollY;
    }

    // Three identical frames means the smooth scroll has finished.
    if (stillFrames >= 3) {
      const desired = targetFor(el);
      if (Math.abs(desired - window.scrollY) > 4) {
        window.scrollTo({ top: desired, behavior: "smooth" });
        stillFrames = 0;
      } else {
        return; // Landed.
      }
    }

    // ~4s ceiling so a pathological layout can never leave this running.
    if (frames < 240) requestAnimationFrame(settle);
  };

  requestAnimationFrame(settle);
}

/**
 * Which of `ids` is currently under the navbar, or null when none is (e.g. the
 * hero, which has no nav entry). Replaces react-scroll's `spy`, which marked
 * the first registered section active at scrollTop 0 and so lit up "Experience"
 * while the hero was still on screen.
 */
export function activeSection(ids: string[]): string | null {
  // At the very bottom the last section may never reach the offset line, so
  // claim it explicitly.
  if (window.scrollY >= maxScroll() - 2) {
    for (let i = ids.length - 1; i >= 0; i--) {
      if (document.getElementById(ids[i])) return ids[i];
    }
    return null;
  }

  let current: string | null = null;
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    const { top, bottom } = el.getBoundingClientRect();
    // Section straddles the line just below the navbar.
    if (top <= NAV_OFFSET + 1 && bottom > NAV_OFFSET + 1) current = id;
  }
  return current;
}
