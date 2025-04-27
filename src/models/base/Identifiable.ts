import { idGen } from '@/utils/idGenerator';

export class Identifiable {
  static idGenerator = idGen();

  public id: number;

  constructor(id?: number) {
    if (id) {
      this.id = id;
      return;
    }

    this.id = Identifiable.createId();
  }

  static createId() {
    return Identifiable.idGenerator.next().value;
  }
}
