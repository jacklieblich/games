import ActionCable from "actioncable";

const App = {};
App.cable = ActionCable.createConsumer('ws://localhost:3001/cable');

export default App;