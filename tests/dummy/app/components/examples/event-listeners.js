import { later, cancel } from "@ember/runloop";
import Component from "@ember/component";

const timeouts = {};

export default Component.extend({
  eventTriggered(eventListenerClass) {
    const eventListener = document.querySelector(
      `.event-listener-${eventListenerClass}`
    );
    if (eventListener != null) {
      eventListener.classList.add("active");

      if (timeouts[eventListenerClass]) {
        cancel(timeouts[eventListenerClass]);
        timeouts[eventListenerClass] = undefined;
      }

      timeouts[eventListenerClass] = later(
        this,
        function () {
          eventListener.classList.remove("active");
          delete timeouts[eventListenerClass];
        },
        250
      );
    }
  },
});
