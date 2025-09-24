import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const DeliveryAfterOrderValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const orderDate = group.get('orderDate')?.value;
  const expectedDelivery = group.get('expectedDelivery')?.value;

  if (orderDate && expectedDelivery && new Date(expectedDelivery) < new Date(orderDate)) {
    return { deliveryBeforeOrder: true };
  }
  return null;
};
