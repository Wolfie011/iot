import mitt from "mitt";

// Definicja typów zdarzeń aplikacji
type Events = {

};

// Globalny emitter typu Events
const emitter = mitt<Events>();

export default emitter;
