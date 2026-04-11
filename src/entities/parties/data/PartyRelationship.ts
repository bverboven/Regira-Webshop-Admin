import { EntityBase } from "@/regira_modules/vue/entities";
import type { Party } from "./Entity";

export class PartyRelationship extends EntityBase {
  id: number = 0;
  parentId: number = 0;
  childId: number = 0;
  relationshipTypeId: number = 0;

  startDate?: Date;
  endDate?: Date;

  parent?: Party;
  child?: Party;
  relationshipType?: PartyRelationshipType;

  override get $id(): string | number {
    return this.id || "new";
  }
  override get $title(): string | undefined {
    return this.relationshipType?.title;
  }
}

export class PartyRelationshipType extends EntityBase {
  id: number = 0;
  title: string;

  override get $id(): string | number {
    return this.id || "new";
  }
  override get $title(): string | undefined {
    return this.title;
  }
}
