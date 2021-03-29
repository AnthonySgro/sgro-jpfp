function incrementStudents(state, campusId, increment) {
    // If no campus id, we return the state
    if (!campusId) {
        return state;
    }

    // Find student campus
    const campus = state.allCampuses.find((campus) => campus.id === campusId);

    // If no campus, we return the state
    if (!campus) {
        return state;
    } else {
        // If campus, create new campus object with 1 added to student count
        const updatedCampus = {
            ...campus,
            studentCount: parseInt(campus.studentCount) + increment,
        };

        // Filter out the old campus
        const newAllCampuses = state.allCampuses.filter(
            (campObj) => campObj !== campus,
        );

        // Replace
        return (state = {
            ...state,
            displayedCampuses: [...newAllCampuses, updatedCampus],
            allCampuses: [...newAllCampuses, updatedCampus],
            selectedCampus: updatedCampus,
        });
    }
}

export default incrementStudents;
