"use client";

export default function Navbar() {
  const handleRefresh = () => {
    window.location.href = '/'; 
  };

  return (
    <div className="navbar justify-center bg-base-100">
      <button className="btn btn-ghost text-center text-xl" onClick={handleRefresh}>
        Smart Grow House Monitor
      </button>
    </div>
  );
}
