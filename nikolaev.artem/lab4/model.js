export class Travel {
  constructor(id, travelerName, visitedCountries = []) {
    this.id = id;
    this.travelerName = travelerName;
    this.visitedCountries = [...visitedCountries];
  }

  addCountry(country) {
    this.visitedCountries.push(country);
  }

  removeCountry(country) {
    this.visitedCountries = this.visitedCountries.filter(
      (item) => item !== country,
    );
  }

  get visitedCount() {
    return this.visitedCountries.length;
  }
}

export function groupTravelsByCountryCount(travels) {
  const groups = new Map();
  for (const travel of travels) {
    const count = travel.visitedCount;
    if (!groups.has(count)) {
      groups.set(count, []);
    }
    groups.get(count).push(travel);
  }
  return groups;
}

export function getUniqueCountries(travels) {
  const countries = new Set();
  for (const travel of travels) {
    for (const country of travel.visitedCountries) {
      countries.add(country);
    }
  }
  return [...countries];
}

export function findTravelsByCountry(travels, country) {
  return travels.filter((travel) => travel.visitedCountries.includes(country));
}

export function groupTravelersByCountry(travels) {
  const groups = new Map();
  for (const travel of travels) {
    for (const country of travel.visitedCountries) {
      if (!groups.has(country)) {
        groups.set(country, []);
      }
      groups.get(country).push(travel.travelerName);
    }
  }
  return groups;
}

export function findTravelsAboveCountryCount(travels, minCount) {
  return travels.filter((travel) => travel.visitedCount > minCount);
}
