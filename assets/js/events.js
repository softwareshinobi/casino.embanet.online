console.log("hello from events.js");

const events = {
  events: {},
  
  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
    return () => this.unsubscribe(event, callback); // returns an unsubscribe function
  },
  
  unsubscribe(event, callback) {
    this.events[event] = this.events[event]?.filter(cb => cb !== callback);
  },
  
  publish(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }
};
