const Tasks = () => {
    // Sample task data
    const tasks = [
      { title: "Design Website UI", progress: 60, deadline: "2024-12-30", status: "In Progress" },
      { title: "Fix Bugs in Backend", progress: 100, deadline: "2024-12-25", status: "Completed" },
      { title: "Prepare Documentation", progress: 30, deadline: "2024-12-28", status: "In Progress" },
      { title: "Code Review", progress: 80, deadline: "2024-12-29", status: "In Progress" },
    ];
  
    return (
      <div className="task-performance-section p-4">
        {/* card */}
        <h4 className="text-center mb-4">Task & Performance</h4>
        
        {/* Active Tasks with Progress Bars */}
        <div className="mb-4">
          <h5>Active Tasks</h5>
          <ul className="list-group">
            {tasks.map((task, index) => (
              <li key={index} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <strong>{task.title}</strong>
                  <span className={`badge ${task.status === "Completed" ? "bg-success" : "bg-warning"}`}>
                    {task.status}
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="progress mt-2">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${task.progress}%` }}
                    aria-valuenow={task.progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {task.progress}%
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span className="text-muted">Deadline: {task.deadline}</span>
                  <span className="text-muted">{task.progress === 100 ? "Completed" : "In Progress"}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        </div>
    )
}
export default Tasks ;