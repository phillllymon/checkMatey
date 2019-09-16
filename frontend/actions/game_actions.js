
export const UPDATE_GAME = 'UPDATE_GAME';

//PLACEHOLDER ONLY
export const archiveGame = (game) => {
    console.log('It looks like you want to save your game. Would you like some help with that?');
};

export const updateGame = (game) => {
    return {
        type: UPDATE_GAME,
        game: game
    };
};