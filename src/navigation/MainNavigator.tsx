import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainTabParamList, ExpensesStackParamList, ProfileStackParamList} from '../types';
import DashboardScreen from '../screens/DashboardScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ExpenseDetailScreen from '../screens/ExpenseDetailScreen';
import CategoryScreen from '../screens/CategoryScreen';


const ExpenseStack = createNativeStackNavigator<ExpensesStackParamList>()

function ExpensesStackNavigator() {
    return (
        <ExpenseStack.Navigator>
            <ExpenseStack.Screen name="ExpensesList" component={ExpensesScreen} options={{title: 'Uitgaven'}} />
            <ExpenseStack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} options={{title: 'Detail'}} />
        </ExpenseStack.Navigator>
    )
}

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>()

function ProfileStackNavigator() {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{title: 'Profiel'}} />
            <ProfileStack.Screen name="Categories" component={CategoryScreen} options={{title: 'Categorieën'}} />
        </ProfileStack.Navigator>
    )
}

const Tab = createBottomTabNavigator<MainTabParamList>()

export default function MainNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Dashboard" component={DashboardScreen} options={{title: 'Dashboard'}} />
            <Tab.Screen name="Expenses" component={ExpensesStackNavigator} options={{headerShown: false, title: 'Uitgaven'}} />
            <Tab.Screen name="AddExpense" component={AddExpenseScreen} options={{title: 'Uitgave toevoegen'}} />
            <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{headerShown: false, title: 'Profiel'}} />
        </Tab.Navigator>
    )
}