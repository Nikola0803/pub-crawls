function VenueList({ venues, onEdit, onDelete }) {
  return (
    <div className="venue-list">
      {venues.map(venue => (
        <div className="venue-card" key={venue.id}>
          <h3>{venue.Name || "Untitled"}</h3>
          <p>{venue.Location || "No location"}</p>
          {venue.Description?.map((d, i) => (
            <p key={i}>{d.children[0]?.text}</p>
          ))}
          <button onClick={() => onEdit(venue)}>Edit</button>
          <button onClick={() => onDelete(venue.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default VenueList;
