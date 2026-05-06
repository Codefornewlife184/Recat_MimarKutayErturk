export function notifyPageMounted() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  // Mark a pending refresh so vendor scripts can catch up on direct page loads.
  window.__antraPendingPageMounted = true

  document.dispatchEvent(new CustomEvent('page:mounted'))

  const $ = window.jQuery
  if ($) {
    $(document).trigger('page:mounted')
  }
}
