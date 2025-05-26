import React from 'react';
import { Container, useMediaQuery } from '@mui/material';
import { PageHeader } from './components/PageHeader';
import { ActionsBar } from './components/ActionsBar';
import { ProductTable } from './components/ProductTable';
import { ProductRow } from './components/ProductsRow';
import { productsMock } from './mock';
import { Product } from './components/types';

const ProductsPage: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [brand, setBrand] = React.useState('');
  const [products, setProducts] = React.useState<Product[]>(productsMock);
  const isDownSm = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  React.useEffect(() => {
    let tmp = productsMock.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase())
    );
    if (category) tmp = tmp.filter((p) => p.category === category);
    if (brand) tmp = tmp.filter((p) => p.brand === brand);
    setProducts(tmp);
  }, [query, category, brand]);

  return (
    <Container>
      <PageHeader />
      <ActionsBar
        query={query}
        onQueryChange={setQuery}
        categoryFilter={category}
        onCategoryChange={setCategory}
        brandFilter={brand}
        onBrandChange={setBrand}
      />
      {isDownSm
        ? products.map((p) => <ProductRow key={p.id} product={p} />)
        : <ProductTable rows={products} />}
    </Container>
  );
};
export default ProductsPage;
