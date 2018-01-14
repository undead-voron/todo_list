import React from 'react';
import Main from './components/Main';
import Task from './components/Task';
import NewTask from './components/NewTask';
import EditTask from './components/EditTask';
import {
	Router,
	Scene,
} from 'react-native-router-flux';

class App extends React.Component {
	render(){
		return (
			<Router>
				<Scene key='root'>
					<Scene key='main' component={Main} title="Main"/>
					<Scene key='task' component={Task} title="Task"/>
					<Scene key='newTask' component={NewTask} title="NewTask"/>
					<Scene key='editTask' component={EditTask} title="EditTask"/>
				</Scene>
			</Router>
		)
	}
}

export default App;