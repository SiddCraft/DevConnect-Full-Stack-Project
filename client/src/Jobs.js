import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Jobs.css";

const Jobs = () => {
  const [jobData, setJobData] = useState({ title: "", description: "", company: "", location: "", salary: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [view, setView] = useState("main"); // ✅ Controls which section is visible

  useEffect(() => {
    axios.get(`http://localhost:5000/api/jobs?search=${searchQuery}`).then((res) => {
      setJobs(res.data);
    });
  }, [searchQuery]);

  const handlePostJob = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/jobs", jobData);
    alert("Job Posted!");
    setJobData({ title: "", description: "", company: "", location: "", salary: "" });
    setView("main"); // ✅ Go back to main Jobs section after posting
  };

  return (
    <div className="jobs-container">
      {view === "main" && (
        <>
          {/* ✅ Buttons to choose Post Job or Search Jobs */}
          <button onClick={() => setView("post")}>Post a Job</button>
          <button onClick={() => setView("search")}>Search Jobs</button>
        </>
      )}

      {/* ✅ Post Job Section */}
      {view === "post" && (
        <div className="post-job">
          <h2>Post a Job</h2>
          <form onSubmit={handlePostJob}>
            <input type="text" name="title" placeholder="Job Title" onChange={(e) => setJobData({ ...jobData, title: e.target.value })} required />
            <input type="text" name="company" placeholder="Company Name" onChange={(e) => setJobData({ ...jobData, company: e.target.value })} required />
            <textarea name="description" placeholder="Job Description" onChange={(e) => setJobData({ ...jobData, description: e.target.value })} required></textarea>
            <input type="text" name="location" placeholder="Location" onChange={(e) => setJobData({ ...jobData, location: e.target.value })} required />
            <input type="text" name="salary" placeholder="Salary" onChange={(e) => setJobData({ ...jobData, salary: e.target.value })} required />
            <button type="submit">Post Job</button>
            <button type="button" onClick={() => setView("main")}>Back</button> {/* ✅ Back button */}
          </form>
        </div>
      )}

      {/* ✅ Search Jobs Section */}
      {view === "search" && (
        <div className="search-jobs">
          <h2>Search Jobs</h2>
          <input type="text" placeholder="Search for jobs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <button onClick={() => setView("main")}>Back</button> {/* ✅ Back button */}

          {/* ✅ Display Job Listings */}
          <div className="job-listings">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job._id} className="job-item">
                  <h3>{job.title}</h3>
                  <p><strong>Company:</strong> {job.company}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Salary:</strong> {job.salary}</p>
                  <p><strong>Description:</strong> {job.description}</p>
                </div>
              ))
            ) : (
              <p>No jobs found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
