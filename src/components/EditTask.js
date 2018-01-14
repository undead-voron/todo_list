import React from 'react';
import {
	View,
	Text,
	TextInput,
	AsyncStorage,
	TouchableOpacity,
	DatePickerIOS,
	Picker,
	StyleSheet,
	ScrollView,
	Modal,
} from 'react-native';
import { Actions } from 'react-native-router-flux';


class EditTask extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			tasks: {
				arr: []
			},
			task:{
				title: '',
				description:'',
				status:{
					done: false,
					time: undefined
				},
				lvl: 0,
				deadline: {},
			},
			// control modal
			dateModalVisible: false,
			lvlModalVisible: false,
		};
		// names for priority levels
		this.priorities = ["Unimportant", "Important", "Very Important"];
	};

	componentDidMount(){
		// get data from store
		AsyncStorage.getItem('tasks').then((data)=>{
			// add data from store into pages state
			this.setState({
				tasks: JSON.parse(data)
			});
			const task = Object.assign({}, JSON.parse(data).arr[this.props.navigation.state.params.index]);
			this.setState({
				task: task
			});
		});
	}

	// format date
	getTime(time){
		const d = new Date();
		d.setTime(time);
		return d
	}
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
			<View style={{flex:1}}>
				<ScrollView>
					<Text>
						Set a name for your task:
					</Text>
					<View
						style={styles.inputContainer}
					>
						<TextInput
							placeholder="Task's Title"
							style={styles.input}
							defaultValue={this.state.task.title}
							onChangeText={(text)=>{
								const newTask = Object.assign({}, this.state.task, {title: text});
								this.setState({
									task: newTask
								});
							}}
						/>
					</View>
					<Text>
						Edit Description:
					</Text>
					<View
						style={styles.inputContainer}
					>
						<TextInput
							placeholder="Task's description"
							multiline = {true}
							numberOfLines = {10}
							style={{
								paddingVertical: 10,
								minHeight: 75,
							}}
							onChangeText={(text)=>{
								const newTask = Object.assign({}, this.state.task, {description: text});
								this.setState({
									task: newTask
								});
							}}
							defaultValue={this.state.task.description}
						/>
					</View>
					<View
						style={styles.info}
					>
						<Text style={styles.infoText}>
							Priority: {this.priorities[this.state.task.lvl]}
						</Text>
						<TouchableOpacity
							onPress={() => this.setState({lvlModalVisible: true})}
							style={{paddingHorizontal: 15}}
						>
							<Text style={styles.infoButtonText}>
								Change
							</Text>
						</TouchableOpacity>
					</View>
					<View
						style={styles.info}
					>
						<Text style={styles.infoText}>
							Deadline: { this.state.task.deadline ? this.getDeadline(this.state.task.deadline) : 'none'}
						</Text>
						<TouchableOpacity
							onPress={() => this.setState({dateModalVisible: true})}
							style={{paddingHorizontal: 15}}
						>
							<Text style={styles.infoButtonText}>
								Change
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
				<View style={styles.footerContainer}>
					<TouchableOpacity
						onPress={() => {
							let newTasks = Array.from(this.state.tasks.arr);
							newTasks.splice(this.props.navigation.state.params.index, 1, this.state.task);
							AsyncStorage.mergeItem('tasks', JSON.stringify({arr: newTasks}));
							Actions.main({type: 'replace'});
						}}
						style={styles.buttonWrapper}
					>
						<Text style={styles.buttonText}>
							Save
						</Text>
					</TouchableOpacity>
				</View>
				<Modal
					visible={this.state.lvlModalVisible}
					animationType={'slide'}
					onRequestClose={() => this.closeModal()}
				>
					<View style={styles.modalContainer}>
						<View style={{alignItems: 'center',}}>
							<Text style={styles.title}>Select Task's Priority</Text>
						</View>
						<Picker
							selectedValue={this.state.task.lvl}
							onValueChange={(itemValue, itemIndex) => {
								const newTask = Object.assign({}, this.state.task, { lvl: itemValue});
								this.setState({
									task: newTask
								});
							}}
						>
							<Picker.Item label="Unimportant" value={0} />
							<Picker.Item label="Important" value={1} />
							<Picker.Item label="Very Important" value={2} />
						</Picker>
						<View style={{alignItems: 'center',}}>
							<TouchableOpacity
								onPress={() => this.setState({lvlModalVisible:false})}
								style={styles.buttonWrapper}
							>
								<Text style={styles.buttonText}>
									Save
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
				<Modal
					visible={this.state.dateModalVisible}
					animationType={'slide'}
					onRequestClose={() => this.closeModal()}
					onShow={() => {
						if (!this.state.task.deadline){
							const d = new Date();
							d.setDate(d.getDate() + 1);
							const newTask = Object.assign({}, this.state.task, { deadline: d.getTime()});
							this.setState({
								task: newTask
							});
						}
					}}
				>
					<View style={styles.modalContainer}>
						<View style={{alignItems: 'center',}}>
							<Text style={styles.title}>Select Task's Deadline</Text>
						</View>
						<DatePickerIOS
							date={this.getTime(this.state.task.deadline)}
							onDateChange={(date)=>{
								const newTask = Object.assign({}, this.state.task, { deadline: Date.parse(date)});
								this.setState({
									task: newTask
								});
							}}
						/>
						<View style={{alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row'}}>
							<TouchableOpacity
								onPress={() => this.setState({dateModalVisible:false})}
								style={styles.buttonWrapper}
							>
								<Text style={styles.buttonText}>
									Save
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									this.setState({dateModalVisible: false});
									const newTask = Object.assign({}, this.state.task, {deadline: false});
									this.setState({task: newTask});
								}}
								style={styles.buttonWrapper}
							>
								<Text style={styles.buttonText}>
									No Deadline
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	inputContainer:{
		backgroundColor: '#fff',
		margin: 5,
		paddingHorizontal: 5,
	},
	input: {
		paddingVertical: 10,
	},
	buttonWrapper:{
		borderRadius: 5,
		backgroundColor: '#1997c6',
		paddingHorizontal: 20,
		paddingVertical: 5,
	},
	buttonText:{
		fontSize: 20,
		flex: 0,
		color: '#fff'
	},
	footerContainer: {
		flex: 0,
		alignContent: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 5,
		backgroundColor: '#fff',
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'white',
	},
	info: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		paddingVertical: 10
	},
	infoText: {
		fontSize: 17,
	},
	infoButtonText: {
		fontSize: 17,
		flex: 0,
		color: '#1997c6'
	},
	title:{
		fontWeight: "900",
		fontSize: 20,
	},
});

export default EditTask