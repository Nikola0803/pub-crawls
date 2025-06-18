const API_URL = "https://srv730752.hstgr.cloud/api/venues";

export async function fetchVenues(query = "") {
  const res = await fetch(
    `https://srv730752.hstgr.cloud/api/venues?filters[Name][$containsi]=${encodeURIComponent(query)}`
  );
  const json = await res.json();

  console.log("🎯 fetchVenues raw JSON:", json);

  // Assuming Strapi returns { data: [ { id, ... } ] } — no attributes
  const venues = json.data.map(item => {
    console.log("➡️ item:", item);
    return {
      id: item.id,
      Name: item.Name,
      Location: item.Location,
      Description: item.Description
    };
  });

  console.log("✅ Parsed venues:", venues);
  return venues;
}




export async function createVenue(venue) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: venue }),
  });
  const json = await res.json();
  return { id: json.data.id, ...json.data.attributes };
}

const BASE_URL = "https://srv730752.hstgr.cloud/api/venues";

export async function updateVenue(id, data) {
  // 🚫 Remove `id` from data if it exists
  const { id: _, ...safeData } = data;

  const res = await fetch('https://srv730752.hstgr.cloud/api/venues/update-by-id', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      data: safeData, // ✅ use cleaned data
    }),
  });

  let result;

  try {
    result = await res.json();
  } catch (err) {
    throw new Error(`❌ Failed to parse response: ${res.status}`);
  }

  if (!res.ok) {
    console.error('❌ Full backend response:', result);
    throw new Error(`❌ Failed to update venue: ${result?.error || result?.message || res.status}`);
  }

  return result.entry;
}

export async function deleteVenue(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}
