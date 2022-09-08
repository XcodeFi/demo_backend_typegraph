export enum OrderStatus {
  NewOrder = 0,
  IsConfirming = 1,
  IsAccepted = 2,
  IsPreparing = 3,
  IsCancelled = 4,
  ReadyForDelivery = 5,
  IsDelivered = 6,
  ReadyForPickup = 7,
  IsPickedUp = 8,
}
