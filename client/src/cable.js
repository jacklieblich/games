import ActionCable from "actioncable";

const App = {};

App.cable = ActionCable.createConsumer(process.env.REACT_APP_API_URL);

export default App;