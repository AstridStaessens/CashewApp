import {NavigatorScreenParams} from '@react-navigation/native';

//Uitgave
export interface Expense {
    id: string;
    amount: number;
    description: string;
    date: Date;
    category: string;
    location: string;
    createdAt: Date;
    receiptPhotoUri: string;
}

//Categorie
export interface Category {
    id: string;
    name: string;
    icon:string;
    color: string;
    isCustom: boolean; // aangeven of categorie standaard is of door de gebruiker is toegevoegd
}

//navigatie
export type AuthStackParamList = {
  Login: undefined
  Register: undefined
}

export type ExpensesStackParamList = {
    ExpensesList: undefined;
    ExpenseDetail: { expenseId: string };
}

export type ProfileStackParamList = {
  ProfileMain: undefined
  Categories: undefined
}

export type MainTabParamList = {
  Dashboard: undefined
  Expenses: NavigatorScreenParams<ExpensesStackParamList>
  AddExpense: undefined
  Profile: NavigatorScreenParams<ProfileStackParamList>
}
