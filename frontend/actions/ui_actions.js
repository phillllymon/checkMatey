export const TOGGLE_HINTS = 'TOGGLE_HINTS';
export const SET_TOUR = 'SET_TOUR';


export const toggleHints = () => {
    return {
        type: TOGGLE_HINTS
    };
};

export const setTour = (newTour) => {
    return {
        type: SET_TOUR,
        newTour: newTour
    };
};