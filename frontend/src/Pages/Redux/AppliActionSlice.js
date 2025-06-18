import { setApplications } from './AppliModelSlice';

export const fetchApplications = (workerEmail) => async (dispatch) => {
  try {
    // const response = await fetch(
    //   `http://localhost:5000/api/applications?workerEmail=${workerEmail}`
    // );
    const response = await fetch(`http://localhost:5000/api/apply?workerEmail=${workerEmail}`);
    const data = await response.json();
    dispatch(setApplications(data));
  } catch (error) {
    console.error("Error fetching applications:", error);
  }
};
