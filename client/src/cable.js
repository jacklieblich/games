import ActionCable from "actioncable";

const App = {};

App.cable = ActionCable.createConsumer(process.env.REACT_APP_SOCKET_URL);

export default App;