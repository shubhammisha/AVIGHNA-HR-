const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        <div className="premium-card">
          <h3>Active JDs</h3>
          <p className="large-stat">12</p>
        </div>
        <div className="premium-card">
          <h3>Total Candidates</h3>
          <p className="large-stat">458</p>
        </div>
        <div className="premium-card">
          <h3>Interviews Today</h3>
          <p className="large-stat">5</p>
        </div>
      </div>

      <div className="recent-activity premium-card">
        <h3>Recent Activity</h3>
        <div className="activity-item">
          <span className="dot blue"></span> AI parsed 50 new resumes for "Senior Backend Engineer"
        </div>
        <div className="activity-item">
          <span className="dot green"></span> Interview summary generated for "John Doe"
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
