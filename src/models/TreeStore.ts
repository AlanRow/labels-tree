type ItemId = number | string;

interface RawDataItem {
  id: ItemId;
  parent: ItemId | null;
  label: string;
}

export class TreeStore {
  constructor(data: RawDataItem[]) {
    throw Error("Not implemented")
  }

  getAll(): RawDataItem {
    throw Error("Not implemented")
  }
  getItem(id: ItemId): RawDataItem | undefined {
    throw Error("Not implemented")
  }
  getChildren(id: ItemId): RawDataItem[] {
    throw Error("Not implemented")
  }
  getAllChildren(id: ItemId): RawDataItem[] {
    throw Error("Not implemented")
  }
  getAllParents(id: ItemId): RawDataItem[] {
    throw Error("Not implemented")
  }
  addItem(item: RawDataItem): void {
    throw Error("Not implemented")
  }
  removeItem(id: ItemId): void {
    throw Error("Not implemented")
  }
  updateItem(newData: { id: ItemId } & Partial<RawDataItem>): void {
    throw Error("Not implemented")
  }
}