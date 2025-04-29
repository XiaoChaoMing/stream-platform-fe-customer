import React from "react";

const Overview = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
          <p className="text-muted-foreground">Your followed channels recent activities will appear here.</p>
        </div>
        <div className="bg-card p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Recommended Streams</h3>
          <p className="text-muted-foreground">Recommended streams based on your interests will appear here.</p>
        </div>
        <div className="bg-card p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Upcoming Events</h3>
          <p className="text-muted-foreground">Events from channels you follow will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
