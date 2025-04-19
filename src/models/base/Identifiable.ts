import { idGen } from '@/utils/idGenerator';

export class Identifiable {
  static idGenerator = idGen();

  id: number;

  constructor() {
    this.id = Identifiable.createId();
  }

  static createId() {
    return Identifiable.idGenerator.next().value;
  }
}
