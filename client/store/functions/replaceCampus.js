function replaceCampus(state, newCampus) {
    // Find student campus
    const campus = state.allCampuses.find(
        (campus) => campus.id === newCampus.id,
    );

    // If no campus, we return the state. We should find it though...
    if (!campus) {
        return state;
    } else {
        // Filter out the old campus
        const newAllCampuses = state.allCampuses.filter(
            (campObj) => campObj.id !== campus.id,
        );

        // Replace
        return (state = {
            ...state,
            allCampuses: [...newAllCampuses, newCampus],
            selectedCampus: newCampus,
        });
    }
}

export default replaceCampus;
