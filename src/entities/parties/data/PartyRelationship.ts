import { EntityBase } from "@/regira_modules/vue/entities";
import type { Party } from "./Entity";
import type PartyRelationshipType from "@/entities/party-relationship-types/data/Entity";

export { default as PartyRelationshipType } from "@/entities/party-relationship-types/data/Entity";

export class PartyRelationship extends EntityBase {
  id: number = 0;
  parentId: number = 0;
  childId: number = 0;
  relationshipTypeId: number = 0;

  sortOrder: number = 0;

  startDate?: Date;
  endDate?: Date;

  parent?: Party;
  child?: Party;
  relationshipType?: PartyRelationshipType;

  _deleted: boolean = false;

  override get $id(): string | number {
    return this.id || "new";
  }
  override get $title(): string | undefined {
    return this.relationshipType?.title;
  }

  static create(values?: object): PartyRelationship {
    return Object.assign(new PartyRelationship(), values || {});
  }
}
