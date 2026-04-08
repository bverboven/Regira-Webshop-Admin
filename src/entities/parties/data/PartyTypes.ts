export const PartyTypes = {
  Person: "PERSON",
  Organization: "ORGANIZATION",
} as const;

export type PartyTypes = (typeof PartyTypes)[keyof typeof PartyTypes];

export default PartyTypes;
