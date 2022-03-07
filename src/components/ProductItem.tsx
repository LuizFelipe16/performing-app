import { memo, useState } from 'react';
import dynamic from 'next/dynamic';

import { AddProductToWishlistProps } from './AddProductToWishlist';
// import { AddProductToWishlist } from './AddProductToWishlist'; isso é comum

// - Code Splitting / Dynamic Import 
const AddProductToWishlist = dynamic<AddProductToWishlistProps>(() => {
  return import('./AddProductToWishlist').then(mod => mod.AddProductToWishlist);
}, {
  loading: () => <span>Carregando</span>
});

interface ProductItemProps {
  product: {
    id: number;
    price: number;
    title: string;
    priceFormatted: string;
  }

  onAddToWishlist: (id: number) => void;
}

// 1° After applying the memo

function ProductItemComponent({ product, onAddToWishlist }: ProductItemProps) {
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  // Code Splitting / Dynamic Import in function
  // async function showFormattedDate() {
  //   const { format } = await import('date-fns');

  //   ... agora só usar
  //   format();
  // }

  return (
    <div>
      {product.title} - <strong>{product.priceFormatted}</strong>
      <button onClick={() => setIsAddingToWishlist(true)}>Adicionar aos favoritos</button>
      {/* Para o useCallback <button onClick={() => onAddToWishlist(product.id)}>Add to wishlist</button> */}

      {/* Para a CodeSplitting */}
      {!!isAddingToWishlist && (
        <AddProductToWishlist
          onAddToWishlist={() => onAddToWishlist(product.id)}
          onRequestClose={() => setIsAddingToWishlist(false)}
        />
      )}
    </div>
  );
}

export const ProductItem = memo(ProductItemComponent, (prevProps, nextProps) => {
  // 2°
  //Aqui dentro precisamos retornar uma condição que vai dizer se product 
  // "novo" é igual ao product anterior

  return Object.is(prevProps.product, nextProps.product)
  // esse método faz uma comparação profunda nas propriedades, e que custa 
  // mais, então tome cuidado se elas forem muito complexas
});

// Before applying the memo

// export function ProductItem({ product }: ProductItemProps) {
//   return (
//     <div>
//       {product.title} - <strong>{product.price}</strong>
//     </div>
//   );
// }