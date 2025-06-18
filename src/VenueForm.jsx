import { useState, useEffect } from "react";

function extractDescriptionText(desc) {
  return Array.isArray(desc)
    ? desc.map(p => p.children?.[0]?.text || "").join("\n")
    : "";
}

function toStrapiRichText(text) {
  return text.split("\n").map(line => ({
    type: "paragraph",
    children: [{ type: "text", text: line }],
  }));
}

function VenueForm({ venue, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    Name: "",
    Location: "",
    Description: "",
    PriceFrom: "",
  });

  useEffect(() => {
    if (venue) {
      setForm({
        Name: venue.Name || "",
        Location: venue.Location || "",
        Description: extractDescriptionText(venue.Description),
        PriceFrom: venue.PriceFrom || "",
      });
    } else {
      setForm({
        Name: "",
        Location: "",
        Description: "",
        PriceFrom: "",
      });
    }
  }, [venue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      Description: toStrapiRichText(form.Description),
    };
    if (venue?.id) data.id = venue.id;
    onSubmit(data);
  };

  return (
    <form className="venue-form" onSubmit={handleSubmit}>
      <h3>{venue ? "Edit Venue" : "Add New Venue"}</h3>
      <input
        name="Name"
        value={form.Name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        name="Location"
        value={form.Location}
        onChange={handleChange}
        placeholder="Location"
      />
      <textarea
        name="Description"
        value={form.Description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        name="PriceFrom"
        value={form.PriceFrom}
        onChange={handleChange}
        placeholder="Price From"
        type="number"
      />
      <div>
        <button type="submit">{venue ? "Update" : "Add"}</button>
        {venue && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

export default VenueForm;
