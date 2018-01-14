import React from 'react';
import {
	View,
	Text,
	AsyncStorage,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

class Task extends React.Component {
	constructor(props){
		super(props);
		this.state={
			task: {
				title: '',
				description: '',
				status:{
					done: false,
					time: undefined
				} ,
				lvl: 0,
				deadline: {}
			},
			tasks: {
				arr: []
			}
		};
		// names for priority levels
		this.priorities= ["Unimportant", "Important", "Very Important"];
	};


	componentDidMount(){
		// get data from store
		AsyncStorage.getItem('tasks').then((data)=>{
			this.setState({
				tasks: JSON.parse(data)
			});
			this.setState({
				task: JSON.parse(data).arr[this.props.navigation.state.params.index]
			})
		});
	}

	// format date
	getDeadline(seconds){
		const d = new Date();
		d.setTime(seconds);
		const day = [
			"Sun",
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat"
		];
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec"
		];

		const hours = d.getHours() === 0 ? 12 : d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
		const postfix = d.getHours() < 12 ? 'am' : 'pm';

		return day[d.getDay()] + ' ' + months[d.getMonth()] + ' ' + d.getDate() + '  ' + hours + ':' + ('0' + d.getMinutes()).slice(-2) + ' ' + postfix;
	}

	render(){
		return (
			<View style={{flex:1, paddingTop: 3}}>
				<ScrollView
					centerContent={true}
				>
					<View
						style={{
							flex: 2,
							justifyContent: 'center',
						}}
					>
						<View style={styles.elementWrapper}>
							<Text style={styles.title}>
								{this.state.task.title}
							</Text>
						</View>
						<View style={styles.elementWrapper}>
							<Text style={styles.description}>
								{this.state.task.description}
							</Text>
						</View>
						{
							this.state.task.deadline ? <View style={styles.elementWrapper}>
								<Text style={styles.description}>
									Deadline: {this.getDeadline(this.state.task.deadline)}
								</Text>
							</View> : <View/>
						}
						<View style={styles.elementWrapper}>
							<Text style={styles.description}>
								Priority: {this.priorities[this.state.task.lvl]}
							</Text>
						</View>
						{
							this.state.task.status.done ?
							<View style={styles.elementWrapper}>
								<Text style={styles.description}>
									Task was done at: {this.getDeadline(this.state.task.status.time)}
								</Text>
							</View> : <View/>
						}

					</View>
					</ScrollView>
				<View style={styles.footerContainer}>
					<TouchableOpacity
						onPress={()=>{
							Actions.editTask({
								index: this.props.navigation.state.params.index
							});
						}}
						style={this.state.task.status.done ? styles.disabledButtonWrapper : styles.buttonWrapper}
						disabled={this.state.task.status.done}
					>
						<Text style={styles.buttonText}>
							Edit
						</Text>
					</TouchableOpacity>
					{
						!this.state.task.status.done ?
							<TouchableOpacity
								onPress={()=>{
									const d = new Date();
									const newTask = Object.assign({}, this.state.task, {status:{done: true, time: d.getTime()}});
									let newArr = Array.from(this.state.tasks.arr);
									newArr.splice([this.props.navigation.state.params.index], 1, newTask);
									AsyncStorage.mergeItem('tasks', JSON.stringify({arr: newArr}));
									this.setState({task: newTask});
								}}
								style={styles.buttonWrapper}
							>
								<Text style={styles.buttonText}>
									Mark as done
								</Text>
							</TouchableOpacity> :
							<View/>
					}

					<TouchableOpacity
						onPress={()=>{
							let newArr = Array.from(this.state.tasks.arr);
							newArr.splice(this.props.navigation.state.params.index, 1);
							AsyncStorage.mergeItem('tasks', JSON.stringify({arr: newArr}));
							Actions.main({type: 'replace'});
						}}
						style={styles.redButtonWrapper}
					>
						<Text style={styles.buttonText}>
							Delete it
						</Text>
					</TouchableOpacity>
				</View>

			</View>
		)
	}
}

const styles = StyleSheet.create({
	footerContainer: {
		flex: 0,
		alignContent: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 5,
		backgroundColor: '#fff',
	},
	redButtonWrapper:{
		borderRadius: 5,
		backgroundColor: '#FF5C5C',
		paddingHorizontal: 20,
		paddingVertical: 5,
	},
	buttonWrapper:{
		borderRadius: 5,
		backgroundColor: '#1997c6',
		paddingHorizontal: 20,
		paddingVertical: 5,
	},
	disabledButtonWrapper:{
		borderRadius: 5,
		backgroundColor: '#bbe7f7',
		paddingHorizontal: 20,
		paddingVertical: 5,
	},
	buttonText:{
		fontSize: 20,
		flex: 0,
		color: '#fff'
	},
	title:{
		fontWeight: "900",
		fontSize: 20,
	},
	elementWrapper:{
		borderWidth: 1,
		paddingHorizontal: 10,
		paddingVertical: 7.5,
		marginVertical: 2.5,
		marginHorizontal: 2,
		borderColor: '#E3E3E3',
		backgroundColor: '#FFF',
		alignItems: 'center',
	},
	description: {
		fontSize: 17,
	}
});

export default Task