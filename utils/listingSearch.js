function buildListingSearchQuery(location) {
  const searchTerm = typeof location === "string" ? location.trim() : "";

  if (!searchTerm) {
    return {}; // return empty object
  }

  return {
    $or: [
      { location: { $regex: searchTerm, $options: "i" } },
      { country: { $regex: searchTerm, $options: "i" } },
    ],
  };
}

module.exports = { buildListingSearchQuery };
