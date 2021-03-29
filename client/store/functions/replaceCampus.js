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

        // Copy number of students to the new campus
        const newCampusWithStudentCount = Object.assign(newCampus, {
            studentCount: campus.studentCount,
        });

        // Replace
        return (state = {
            ...state,
            displayedCampuses: [...newAllCampuses, newCampusWithStudentCount],
            allCampuses: [...newAllCampuses, newCampusWithStudentCount],
            selectedCampus: newCampusWithStudentCount,
        });
    }
}

export default replaceCampus;
