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

function getTime(time){
	const d = new Date();
	d.setTime(time);
	return d
}

function getDeadline(seconds){
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

class NewTask extends React.Component {
	constructor(props){
		super(props);
		const d = new Date;
		d.setDate(d.getDate() + 1);
		this.state = {
			tasks: {
				arr: []
			},
			newTask:{
				title: '',
				description:'',
				status: {
					done: false,
					time: undefined
				},
				lvl: 0,
				deadline: d.getTime()
			},
			// control modals
			dateModalVisible: false,
			lvlModalVisible: false,
		};
		// names of priorities
		this.priorities= ["Unimportant", "Important", "Very Important"];
	};

	componentDidMount(){
		AsyncStorage.getItem('tasks').then((data)=>{
			this.setState({
				tasks: JSON.parse(data)
			})
		});
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
						onChangeText={(text)=>{
							const newTask = Object.assign({}, this.state.newTask, {title: text});
							this.setState({
								newTask: newTask
							});
						}}
					/>
				</View>
				<Text>
					Add some information:
				</Text>
				<View
					style={styles.inputContainer}
				>
					<TextInput
						placeholder="Task's description"
						multiline = {true}
						style={{
							paddingVertical: 10,
							minHeight: 75,
						}}
						numberOfLines = {4}
						onChangeText={(text)=>{
							const newTask = Object.assign({}, this.state.newTask, {description: text});
							this.setState({
								newTask: newTask
							});
						}}
					/>
				</View>
				<View
					style={styles.info}
				>
					<Text style={styles.infoText}>
						Priority: {this.priorities[this.state.newTask.lvl]}
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
						Deadline: { this.state.newTask.deadline ? getDeadline(this.state.newTask.deadline) : 'none'}
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
						newTasks.unshift(this.state.newTask);
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
						selectedValue={this.state.newTask.lvl}
						onValueChange={(itemValue, itemIndex) => {
							const newTask = Object.assign({}, this.state.newTask, { lvl: itemValue});
							this.setState({
								newTask: newTask
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
					if (!this.state.newTask.deadline){
						const d = new Date();
						d.setDate(d.getDate() + 1);
						const newTask = Object.assign({}, this.state.newTask, { deadline: d.getTime()});
						this.setState({
							newTask: newTask
						});
					}
				}}
			>
				<View style={styles.modalContainer}>
					<View style={{alignItems: 'center',}}>
						<Text style={styles.title}>Select Task's Deadline</Text>
					</View>
					<DatePickerIOS
						date={getTime(this.state.newTask.deadline)}
						onDateChange={(date)=>{
							const newTask = Object.assign({}, this.state.newTask, { deadline: Date.parse(date)});
							this.setState({
								newTask: newTask
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
								const newTask = Object.assign({}, this.state.newTask, {deadline: false});
								this.setState({newTask: newTask});
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

export default NewTask