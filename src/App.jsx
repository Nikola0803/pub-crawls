import { useEffect, useState } from "react";
import {
  fetchVenues,
  createVenue,
  updateVenue,
  deleteVenue,
} from "./api";
import VenueForm from "./VenueForm";
import "./App.css";

function App() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [query, setQuery] = useState("Trinity Cider");

  useEffect(() => {
    fetchVenues(query).then(setVenues);
  }, [query]);

  const handleAdd = async (venue) => {
    const newVenue = await createVenue(venue);
    setVenues([...venues, newVenue]);
  };

const handleUpdate = async (venue) => {
  if (!venue.id) {
    console.error("Venue missing ID");
    return;
  }

  const updated = await updateVenue(venue.id, venue);
  setVenues(venues.map(v => v.id === updated.id ? updated : v));
  setSelectedVenue(null);
};


  const handleDelete = async (id) => {
    await deleteVenue(id);
    setVenues(venues.filter(v => v.id !== id));
  };

  return (
    <div className="container">
      <h1>Venue Manager</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search venues..."
      />
      <div className="venue-list">
        {venues.map((venue) => (
          <div key={venue.id} className="venue-card">
            <h2>{venue.Name || "Untitled"}</h2>
            <p>{venue.Location || "No location"}</p>
            <button onClick={() => setSelectedVenue(venue)}>Edit</button>
            <button onClick={() => handleDelete(venue.id)}>Delete</button>
          </div>
        ))}
      </div>
      <VenueForm
        venue={selectedVenue}
        onSubmit={selectedVenue ? handleUpdate : handleAdd}
        onCancel={() => setSelectedVenue(null)}
      />
    </div>
  );
}

export default App;
