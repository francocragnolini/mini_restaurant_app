import { useReducer } from "react";
import CartContext from "./cart-context";

// // step 1: default cart state
const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    // checking if the item already has been added to the array
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    // getting the item in a variable (could be null or and  item)
    const existingCartItem = state.items[existingCartItemIndex];

    // variables to update the array

    let updatedItems;

    // checking if exist a duplicate item
    if (existingCartItem) {
      // if exists
      // copy the old item and add the amount so it wont appear the same items with different amounts

      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      // coping the old array
      updatedItems = [...state.items];

      // takes the older item an overwrite it with the new Item
      updatedItems[existingCartItemIndex] = updatedItem;
      //
      // in case the item was not add before to the array
    } else {
      updatedItems = state.items.concat(action.item);
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }
  if (action.type === "REMOVE") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    // getting the item
    const existingItem = state.items[existingCartItemIndex];

    const updatedTotalAmount = state.totalAmount - existingItem.price;

    let updatedItems;
    // if item is the last one we want to remove it from the cart(array)
    if (existingItem.amount === 1) {
      updatedItems = state.items.filter((item) => item.id !== action.id);

      // if item is not the last one we wanna decrease the amount
    } else {
      const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }
  return defaultCartState;
};

const CartContextProvider = (props) => {
  //step 2
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({
      type: "ADD",
      item: item,
    });
  };
  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({
      type: "REMOVE",
      id: id,
    });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };
  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
