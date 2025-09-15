// components/common/LoadingErrorState.js
import Header from "../Components/Header"; // adjust import path if needed

const LoadingErrorState = ({
  loading = false,
  error = null,
  title = "Loading Data...",
  subtitle = "Please wait while we fetch information.",
  spinnerColor = "text-primary",
  showHeader = true,
}) => {
  if (loading) {
    return (
      <>
        {showHeader && <Header />}
        <div className="container mt-5">
          <div className="text-center" style={{ marginTop: "10rem" }}>
            <div
              className={`spinner-border ${spinnerColor} mb-3`}
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4>{title}</h4>
            <p className="text-muted">{subtitle}</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {showHeader && <Header />}
        <div className="container mt-5">
          <div
            className="alert alert-danger text-center"
            style={{ marginTop: "10rem" }}
          >
            {error}
          </div>
        </div>
      </>
    );
  }

  return null;
};

export default LoadingErrorState;
