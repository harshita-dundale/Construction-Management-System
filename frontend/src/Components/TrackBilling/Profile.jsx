import './Profile.css';

const Profile = () => {
  return (
    <div className="container mt-4">
      <div className="card profile-card">  { /*shadow-lg*/}
        <div className="card-body text-center">
          <img
            src="./profile.png"
            alt="Worker"
            className="mb-3 rounded-circle border border-1 border-dark"
            height="180px"
            width="180px"
          />
          <h4 className="card-title name">Rajesh Kumar</h4>

          <div className="text-start mx-auto" style={{ maxWidth: '300px' }}>
            <p className="card-text">
              <strong>ID:</strong> W12345
            </p>
            <p className="card-text">
              <strong>Phone:</strong> 8888 2222 09
            </p>
            <p className="card-text">
              <strong>Position:</strong> Mason
            </p>
            <p className="card-text">
              <strong>Email:</strong> constructhub12@gmail.com
            </p>
          </div>

          <div
            className="badge badge-streak mt-4"
            style={{ backgroundColor: '#f58800', color: '#fff' }}
          >
            Attendance Streak: <span className="fw-bold">5 Days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
