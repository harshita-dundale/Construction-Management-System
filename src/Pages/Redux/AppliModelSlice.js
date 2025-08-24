import { createSlice} from "@reduxjs/toolkit";

const AppliModelSlice = createSlice(
    {
        name : 'applicationsModel',
        initialState : {
            filter : 'All',
            showModal : false,
            currentJob : null,
            allApplications : [
                { title: 'Job A', date: '2025-01-01', status: 'Pending', description: 'Job A Description' },
                { title: 'Job B', date: '2025-01-02', status: 'Selected', description: 'Job B Description' },
                { title: 'Job C', date: '2025-01-03', status: 'Rejected', description: 'Job C Description' },
                { title: 'Job F', date: '2025-01-02', status: 'Selected', description: 'Job B Description' },
                { title: 'Job E', date: '2025-01-01', status: 'Pending', description: 'Job A Description' },
                { title: 'Job G', date: '2025-01-03', status: 'Rejected', description: 'Job C Description' },
            ],
        },
        reducers: {
            setFilter(state, action){
                state.filter = action.payload;
            },
            setShowModal(state, action){
                state.showModal = action.payload;
            },
            setCurrentJob(state, action){
                state.currentJob = action.payload;
            },
        },
    }
);

export const { setFilter, setShowModal, setCurrentJob } = AppliModelSlice.actions;

export default AppliModelSlice.reducer;