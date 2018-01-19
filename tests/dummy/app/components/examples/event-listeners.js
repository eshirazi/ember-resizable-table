/* globals $ */
import Ember from "ember";
const { Component } = Ember;

const timeouts = {};

export default Component.extend({
  eventTriggered(eventListenerClass) {
    const eventListener = $(`.event-listener-${eventListenerClass}`);
    eventListener.addClass("active");

    if (timeouts[eventListenerClass]) {
      clearTimeout(timeouts[eventListenerClass]);
    }

    timeouts[eventListenerClass] = setTimeout(() => {
      eventListener.removeClass("active");
      delete timeouts[eventListenerClass];
    }, 250);
  }
});
