const initialState = {
    fruits: [],
    isLoading: false,
    error: null,
    totalCash: 100.00, 
    inventory: {},
};

const fruitReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_FRUIT':
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case 'SET_FRUIT':
            return {
                ...state,
                fruits: action.payload,
                isLoading: false,
            };
            case 'BUY_FRUIT_REQUEST':
                return {
                  ...state,
                  isLoading: true,
                  error: null,
                };
            case 'BUY_FRUIT_SUCCESS':
                const { fruitId, quantity } = action.payload;
                const fruit = state.fruits.find(fruit => fruit.id === fruitId);
                // If fruit not found, do nothing
                if (!fruit) return state; 
          
                const fruitPrice = parseFloat(fruit.current_price);
                const totalCost = fruitPrice * quantity;
          
                // Update inventory
                const updatedInventory = { ...state.inventory };
                updatedInventory[fruitId] = (updatedInventory[fruitId] || 0) + quantity;
          
                return {
                  ...state,
                  totalCash: state.totalCash - totalCost,
                  inventory: updatedInventory,
                  isLoading: false,
                };
                case 'SET_USER_CASH':
            return {
                ...state,
                totalCash: action.payload,
            };
              default:
                return state;
            }
          };

export default fruitReducer;