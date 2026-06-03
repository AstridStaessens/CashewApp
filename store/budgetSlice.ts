import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface BudgetState {
  limits: Record<string, number>
}

const initialState: BudgetState = {
  limits: {
    wonen: 1000,
    boodschappen: 300,
    gezondheid: 100,
    transport: 150,
    entertainment: 80,
    vaste_kosten: 200,
  },
}

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    setLimit(state, action: PayloadAction<{ categoryId: string; amount: number }>) {
      state.limits[action.payload.categoryId] = action.payload.amount
    },
  },
})

export const { setLimit } = budgetSlice.actions
export default budgetSlice.reducer
