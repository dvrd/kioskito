"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Dispatch, type PropsWithChildren, createContext, useReducer } from "react";

type ActionType = {
  type: 'ADD' | 'REMOVE',
  payload: string
}

type StateType = {
  merchandise: string[];
}

const initialState: StateType = {
  merchandise: [],
};

const reducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "ADD":
      return { ...state, merchandise: [...state.merchandise, action.payload] };
    case "REMOVE":
      const newLines = state.merchandise.filter(item => item !== action.payload);
      return { ...state, merchandise: newLines };
    default:
      return state;
  }
};

export const CartContext = createContext<{
  state: StateType;
  dispatch: Dispatch<ActionType>;
}>({ state: initialState, dispatch: () => null });

export const CartContextProvider = ({ children }: PropsWithChildren) => {
  const cart = useLocalStorage<string[]>('cart', [])

  const [state, dispatch] = useReducer(reducer, { merchandise: cart.value || [] });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
