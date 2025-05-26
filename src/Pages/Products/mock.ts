/* ===================== mock.ts ===================== */
import { Product } from './components/types';
import { faker } from '@faker-js/faker';
export const productsMock: Product[] = Array.from({ length: 25 }, (_, i) => ({
  id: faker.string.uuid(),
  sku: `PT${String(i + 1).padStart(3, '0')}`,
  name: faker.commerce.productName(),
  img: faker.image.urlPicsumPhotos({ width: 40, height: 40 }),
  category: faker.commerce.department(),
  brand: faker.company.name(),
  price: Number(faker.commerce.price({ min: 20, max: 600 })),
  unit: 'Pc',
  qty: faker.number.int({ min: 50, max: 800 }),
  createdBy: { name: faker.person.fullName(), avatar: faker.image.avatar() },
  createdAt: faker.date.past().toISOString(),
  status: faker.datatype.boolean() ? 'active' : 'inactive',
}));