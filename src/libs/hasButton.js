const hasButton = {
    install (Vue, options) {
        Vue.directive('hasButton', {
            bind (el, binding, vnode) {
              debugger
                let buttonTypes = vnode.context.$route.meta.buttonTypes;
                if (buttonTypes   && !buttonTypes.includes(binding.value)) {
                    el.parentNode.removeChild(el);
                }
            }
        });
    }
};

export default hasButton;
