const initialState = {
    fruits: [],
    isLoading: false,
    error: null,
    totalCash: 0, 
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
                fruits: action.payload.map(fruit => ({
                    ...fruit,
                    averagePurchasedPrice: 0, // Initialize
                })),
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

            if (!fruit) return state;

            const fruitPrice = parseFloat(fruit.current_price);
            const totalCost = fruitPrice * quantity;

            const updatedInventory = { ...state.inventory };
            updatedInventory[fruitId] = (updatedInventory[fruitId] || 0) + quantity;

            return {
                ...state,
                totalCash: state.totalCash - totalCost,
                inventory: updatedInventory,
                isLoading: false,
            };
        case 'SELL_FRUIT_SUCCESS':
            const { fruitId: sellFruitId, quantity: sellQuantity } = action.payload;
            const sellFruit = state.fruits.find(fruit => fruit.id === sellFruitId);

            if (!sellFruit) return state;

            const sellFruitPrice = parseFloat(sellFruit.current_price);
            const totalRevenue = sellFruitPrice * sellQuantity;

            const updatedSellInventory = { ...state.inventory };
            if (updatedSellInventory[sellFruitId] >= sellQuantity) {
                updatedSellInventory[sellFruitId] -= sellQuantity;
                if (updatedSellInventory[sellFruitId] === 0) delete updatedSellInventory[sellFruitId];
            }

            return {
                ...state,
                totalCash: state.totalCash + totalRevenue,
                inventory: updatedSellInventory,
                isLoading: false,
            };
        case 'UPDATE_FRUIT_PRICES':
            return {
                ...state,
                fruits: state.fruits.map(fruit => ({
                    ...fruit,
                    current_price: action.payload[fruit.id] || fruit.current_price,
                })),
            };
        case 'FETCH_TOTAL_CASH':
            return {
                ...state,
                totalCash: action.payload,
            };
        case 'UPDATE_PURCHASED_PRICE':
            return {
                ...state,
                fruits: state.fruits.map(fruit => {
                    if (fruit.id === action.payload.fruitId) {
                        const totalPurchases = action.payload.totalPurchases;
                        const totalCost = action.payload.totalCost;
                        const averagePrice = totalCost / totalPurchases;
                        return {
                            ...fruit,
                            averagePurchasedPrice: averagePrice,
                        };
                    }
                    return fruit;
                }),
            };
        default:
            return state;
    }
};

export default fruitReducer;