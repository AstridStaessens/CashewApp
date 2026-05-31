

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


