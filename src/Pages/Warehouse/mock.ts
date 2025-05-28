import { Warehouse } from './components/types';
import { faker } from '@faker-js/faker';

export const warehousesMock: Warehouse[] = Array.from({ length: 12 }).map(
  () => ({
    id: crypto.randomUUID(),
    name: faker.company.name() + ' Warehouse',
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    status: faker.helpers.arrayElement(['active', 'inactive']),
    createdOn: faker.date.between({ from: '2024-09-01', to: '2024-12-25' }).toISOString()
  })
);
