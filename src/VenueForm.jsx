import { useState, useEffect } from "react";
import axios from "axios"; // Make sure axios is installed

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

  const [iconFile, setIconFile] = useState(null);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [existingIconUrl, setExistingIconUrl] = useState(null);
  const [existingFeaturedUrl, setExistingFeaturedUrl] = useState(null);

  useEffect(() => {
    if (venue) {
      setForm({
        Name: venue.Name || "",
        Location: venue.Location || "",
        Description: extractDescriptionText(venue.Description),
        PriceFrom: venue.PriceFrom || "",
      });

      setExistingIconUrl(venue.Icon?.url ? venue.Icon.url : null);
      setExistingFeaturedUrl(venue.featuredImage?.url ? venue.featuredImage.url : null);
    }
  }, [venue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("files", file);
    const res = await axios.post("https://srv730752.hstgr.cloud/api/upload", formData);
    return res.data[0]; // Returns uploaded file metadata
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let iconUpload = null;
    let featuredUpload = null;

    if (iconFile) iconUpload = await uploadFile(iconFile);
    if (featuredImageFile) featuredUpload = await uploadFile(featuredImageFile);

    const data = {
      ...form,
      Description: toStrapiRichText(form.Description),
      Icon: iconUpload ? iconUpload.id : venue?.Icon?.id,
      featuredImage: featuredUpload ? featuredUpload.id : venue?.featuredImage?.id,
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
        <label>Upload Icon:</label>
        {existingIconUrl && (
          <img src={`https://srv730752.hstgr.cloud${existingIconUrl}`} alt="Current Icon" style={{ width: 100 }} />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setIconFile(e.target.files[0])}
        />
      </div>

      <div>
        <label>Upload Featured Image:</label>
        {existingFeaturedUrl && (
          <img src={`https://srv730752.hstgr.cloud${existingFeaturedUrl}`} alt="Featured" style={{ width: 200 }} />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFeaturedImageFile(e.target.files[0])}
        />
      </div>

      <div>
        <button type="submit">{venue ? "Update" : "Add"}</button>
        {venue && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

export default VenueForm;
