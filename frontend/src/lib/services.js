export const SERVICE_SLUGS = {
  plumber:      { label: 'Plumber', skill: 'Plumbing' },
  electrician:  { label: 'Electrician', skill: 'Electrician' },
  cleaning:     { label: 'Cleaning', skill: 'Maid/Cleaning' },
  cooking:      { label: 'Cooking', skill: 'Cooking' },
  babysitting:  { label: 'Babysitting', skill: 'Babysitting' },
  driver:       { label: 'Driver', skill: 'Driver' },
  gardening:    { label: 'Gardening', skill: 'Gardening' },
  laundry:      { label: 'Laundry', skill: 'Laundry' },
  carpenter:    { label: 'Carpenter', skill: 'General Maintenance & Repair' },
  handyman:     { label: 'Handyman', skill: 'General Maintenance & Repair' },
  painter:      { label: 'Painter', skill: 'General Maintenance & Repair' },
  ac:           { label: 'AC Services', skill: 'General Maintenance & Repair' },
  geyser:       { label: 'Geyser', skill: 'Plumbing' },
  pest:         { label: 'Pest Control', skill: 'General Maintenance & Repair' },
  makeup:       { label: 'Makeup Artist', skill: 'General Maintenance & Repair' },
  eldercare:    { label: 'Elder Care', skill: 'Elder Care' },
};

export const buildPricing = (hourlyRate) => {
  const rate = hourlyRate || 500;
  return {
    basic:    { title: 'Quick Service',  price: String(rate),       desc: '1 hour basic service visit.' },
    standard: { title: 'Standard Job',   price: String(rate * 2),   desc: '2 hours of professional work.' },
    premium:  { title: 'Full Service',   price: String(rate * 4),   desc: '4+ hours comprehensive service.' },
  };
};

export const formatTasker = (t) => ({
  id: t._id,
  fullName: t.fullName,
  category: t.skills?.[0] || 'General',
  rating: t.rating?.average?.toFixed(1) || '0.0',
  jobs: String(t.jobsCount || 0),
  location: t.address?.[0] ? `${t.address[0].city}` : 'Pakistan',
  experience: `${t.experienceYears || 0}+ Years`,
  bio: `${t.fullName} is a verified ${t.skills?.join(', ') || 'service'} professional.`,
  skills: t.skills || [],
  image: t.profilePicture,
  hourlyRate: t.hourlyRate,
  pricing: buildPricing(t.hourlyRate),
});
