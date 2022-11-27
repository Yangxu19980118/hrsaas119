export const imgerror = {
  inserted(el, binding) {
    console.log('inserted', el)
    el.onerror = function() {
      el.src = binding.value
    }
  }
}
