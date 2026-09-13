import {useState} from 'react';
import {Link} from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import type {Product} from '../../../shared/types';
import {ProductModal} from '../components/Product';
import {useStore} from '../context/Store';
import {Advantages} from '../features/home/Advantages';
import {Contacts} from '../features/home/Contacts';
import {ProductCarousel} from '../features/home/ProductCarousel';
import {asset} from '../utils/assets';

export function Home() {
  const {goods} = useStore();
  const [product, setProduct] = useState<Product | null>(null);

  return (
    <main className="container home">
      <h1 className="sr-only">Gadget Hub — магазин надежных гаджетов</h1>
      <Link to="/catalog">
        <img
          className="banner"
          src={asset('banner.png')}
          width="1240"
          height="560"
          alt="Умный робот-друг Red solution Reddy Air — 27 990 рублей, скидка 10%"
        />
      </Link>
      <ProductCarousel goods={goods} hit open={setProduct} />
      <ProductCarousel goods={goods} hit={false} open={setProduct} />
      <Advantages />
      <Contacts />
      {product && (
        <ProductModal product={product} close={() => setProduct(null)} />
      )}
    </main>
  );
}
