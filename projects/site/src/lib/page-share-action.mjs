/** Keep a manual link available even when device sharing never settles. */
export async function sharePage({url, title, button, status, fallback, input}, platform) {
  button.disabled = true;
  input.value = url;
  fallback.hidden = false;
  status.textContent = 'Copy the link below or use your device’s sharing options.';
  try {
    if (typeof platform.share === 'function') {
      await platform.share({title, url});
      status.textContent = 'Sharing opened. You can also copy the link below.';
    } else if (typeof platform.clipboard?.writeText === 'function') {
      await platform.clipboard.writeText(url);
      status.textContent = 'Page link copied.';
    } else {
      input.focus();
      input.select();
      status.textContent = 'Copy the link below.';
    }
  } catch (error) {
    if (error?.name === 'AbortError') {
      status.textContent = 'Sharing cancelled. You can still copy the link below.';
    } else {
      input.focus();
      input.select();
      status.textContent = 'Copy the link below.';
    }
  } finally {
    button.disabled = false;
  }
}
