const pakistanPlaces = [
  { name: "Islamabad", region: "Islamabad Capital Territory", aliases: ["capital"] },
  { name: "Lahore", region: "Punjab", aliases: ["lahore city"] },
  { name: "Karachi", region: "Sindh", aliases: ["karachi city"] },
  { name: "Peshawar", region: "Khyber Pakhtunkhwa", aliases: ["kpk"] },
  { name: "Abbottabad", region: "Khyber Pakhtunkhwa", aliases: ["kpk", "hazara"] },
  { name: "Mansehra", region: "Khyber Pakhtunkhwa", aliases: ["kpk", "hazara"] },
  { name: "Rawalpindi", region: "Punjab", aliases: ["pindi"] },
  { name: "Faisalabad", region: "Punjab", aliases: ["lyallpur"] },
  { name: "Multan", region: "Punjab" },
  { name: "Quetta", region: "Balochistan" },
  { name: "Sialkot", region: "Punjab" },
  { name: "Hyderabad", region: "Sindh" },
  { name: "Mardan", region: "Khyber Pakhtunkhwa", aliases: ["kpk"] },
  { name: "Mingora", region: "Khyber Pakhtunkhwa", aliases: ["swat", "kpk"] },
  { name: "Muzaffarabad", region: "Azad Jammu and Kashmir", aliases: ["ajk"] },
  { name: "Bahawalpur", region: "Punjab" },
  { name: "Sargodha", region: "Punjab" },
  { name: "Sukkur", region: "Sindh" },
  { name: "Larkana", region: "Sindh" },
  { name: "Gwadar", region: "Balochistan" },
  { name: "Chitral", region: "Khyber Pakhtunkhwa", aliases: ["kpk"] },
  { name: "Gilgit", region: "Gilgit-Baltistan", aliases: ["gb"] },
  { name: "Skardu", region: "Gilgit-Baltistan", aliases: ["gb"] },
  { name: "Murree", region: "Punjab" },
  { name: "Nathia Gali", region: "Khyber Pakhtunkhwa", aliases: ["nathiagali", "galyat", "kpk"] },
  { name: "Naran", region: "Khyber Pakhtunkhwa", aliases: ["kaghan", "kpk"] },
  { name: "Kaghan", region: "Khyber Pakhtunkhwa", aliases: ["naran", "kpk"] },
  { name: "Swat", region: "Khyber Pakhtunkhwa", aliases: ["mingora", "kpk"] },
  { name: "Hunza", region: "Gilgit-Baltistan", aliases: ["gb"] },
  { name: "Taxila", region: "Punjab" },
  { name: "Gujrat", region: "Punjab" },
  { name: "Jhelum", region: "Punjab" },
  { name: "Sheikhupura", region: "Punjab" },
  { name: "Kasur", region: "Punjab" },
  { name: "Sahiwal", region: "Punjab" },
  { name: "Okara", region: "Punjab" },
  { name: "Dera Ghazi Khan", region: "Punjab", aliases: ["dg khan", "dgk"] },
  { name: "Rahim Yar Khan", region: "Punjab", aliases: ["ryk"] },
  { name: "Gujranwala", region: "Punjab" },
  { name: "Sadiqabad", region: "Punjab" },
  { name: "Kohat", region: "Khyber Pakhtunkhwa", aliases: ["kpk"] },
  { name: "Nowshera", region: "Khyber Pakhtunkhwa", aliases: ["kpk"] },
  { name: "Charsadda", region: "Khyber Pakhtunkhwa", aliases: ["kpk"] },
  { name: "Bannu", region: "Khyber Pakhtunkhwa", aliases: ["kpk"] },
  { name: "Dera Ismail Khan", region: "Khyber Pakhtunkhwa", aliases: ["di khan", "dik", "kpk"] },
  { name: "Haripur", region: "Khyber Pakhtunkhwa", aliases: ["hazara", "kpk"] },
  { name: "Battagram", region: "Khyber Pakhtunkhwa", aliases: ["hazara", "kpk"] },
  { name: "Balakot", region: "Khyber Pakhtunkhwa", aliases: ["kaghan", "kpk"] },
  { name: "Shangla", region: "Khyber Pakhtunkhwa", aliases: ["kpk"] },
  { name: "Dir", region: "Khyber Pakhtunkhwa", aliases: ["upper dir", "lower dir", "kpk"] },
  { name: "Zhob", region: "Balochistan" },
  { name: "Turbat", region: "Balochistan" },
  { name: "Chaman", region: "Balochistan" },
  { name: "Sibi", region: "Balochistan" },
  { name: "Khuzdar", region: "Balochistan" },
  { name: "Loralai", region: "Balochistan" },
  { name: "Mirpur Khas", region: "Sindh", aliases: ["mirpurkhas"] },
  { name: "Nawabshah", region: "Sindh", aliases: ["shaheed benazirabad"] },
  { name: "Thatta", region: "Sindh" },
  { name: "Mirpur", region: "Azad Jammu and Kashmir", aliases: ["ajk"] },
  { name: "Kotli", region: "Azad Jammu and Kashmir", aliases: ["ajk"] },
  { name: "Rawalakot", region: "Azad Jammu and Kashmir", aliases: ["ajk"] },
];

const featuredNames = [
  "Islamabad",
  "Lahore",
  "Karachi",
  "Peshawar",
  "Abbottabad",
  "Mansehra",
  "Murree",
  "Skardu",
];

function toSearchablePlace(place) {
  return {
    id: `pk-${place.name.toLowerCase().replaceAll(" ", "-")}`,
    name: place.name,
    region: place.region,
    country: "Pakistan",
  };
}

function normalize(value) {
  return value.trim().toLocaleLowerCase();
}

const featuredPakistanPlaces = featuredNames.map((name) =>
  toSearchablePlace(pakistanPlaces.find((place) => place.name === name))
);

export function searchPakistanPlaces(query) {
  const searchTerm = normalize(query);

  if (!searchTerm) {
    return featuredPakistanPlaces;
  }

  return pakistanPlaces
    .filter((place) =>
      [place.name, place.region, ...(place.aliases || [])].some((value) =>
        normalize(value).startsWith(searchTerm)
      )
    )
    .map(toSearchablePlace);
}

export { featuredPakistanPlaces };
