function VenueSearch({ query, setQuery }) {
  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search venues..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
    </div>
  );
}

export default VenueSearch;
