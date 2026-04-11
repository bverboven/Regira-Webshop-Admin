import type { AxiosInstance } from "axios";
import { EntityServiceBase, type IConfig } from "@/regira_modules/vue/entities";
import Entity from "./Entity";
import { ContactDetails } from "../party-contact-data/Entity";
import PartyAddress from "../party-addresses/Entity";
import { PartyRelationship } from "./PartyRelationship";

export class EntityService extends EntityServiceBase<Entity> {
  constructor(axios: AxiosInstance, config: IConfig) {
    super(axios, config);
  }

  protected override prepareItem(item: Entity): Entity {
    item.addresses = item.addresses
      ?.filter((x) => !x._deleted)
      .map((x) => PartyAddress.create({ ...x, id: Math.max(0, x.id) }));
    item.contactData = item.contactData
      ?.filter((x) => !x._deleted)
      .map((x) => ContactDetails.create({ ...x, id: Math.max(0, x.id) }));
    item.parentRelationships = item.parentRelationships
      ?.filter((x) => !x._deleted)
      .map((x) => PartyRelationship.create({ ...x, id: Math.max(0, x.id) }));
    item.childRelationships = item.childRelationships
      ?.filter((x) => !x._deleted)
      .map((x) => PartyRelationship.create({ ...x, id: Math.max(0, x.id) }));
    return item;
  }

  override toEntity(item: object): Entity {
    if (item instanceof Entity) {
      return item;
    }
    return Object.assign(new Entity(), item);
  }
}

export default EntityService;
