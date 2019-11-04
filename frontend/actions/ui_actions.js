export const TOGGLE_HINTS = 'TOGGLE_HINTS';
export const SET_TOUR = 'SET_TOUR';
export const SET_CHALLENGE = 'SET_CHALLENGE';


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

export const makeEmailChallenge = (challengeId) => {
    return {
        type: SET_CHALLENGE,
        challengeId: challengeId
    };
}