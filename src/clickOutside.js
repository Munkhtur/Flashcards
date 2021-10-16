/** Dispatch event on click outside of node */
export function clickOutside(node) {
  const nav = document.querySelector('.account-menu');
  const handleClick = (event) => {
    if (
      node &&
      !node.isEqualNode(event.target) &&
      !event.defaultPrevented &&
      !nav.contains(event.target)
    ) {
      node.dispatchEvent(new CustomEvent('click_outside', node));
    }
  };

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    },
  };
}
