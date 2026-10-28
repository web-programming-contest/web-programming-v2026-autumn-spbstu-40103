import {Routes, Route, useLocation} from 'react-router-dom';
import {useState, useEffect} from 'react';

import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';

import {Product} from './components/Structures';
import {ProductCart} from './components/Structures';

function App() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname.slice(1));
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState<Product[]>([]);

  const [username, setUsername] = useState<string>(
    () => localStorage.getItem('username') || '',
  );

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('isLoggedIn') === 'true',
  );

  const [cartItems, setCartItems] = useState<ProductCart[]>(() => {
    const user = localStorage.getItem('username');
    if (!user) return [];
    const saved = localStorage.getItem(`cart_${user}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (!username) return;
    localStorage.setItem(`cart_${username}`, JSON.stringify(cartItems));
  }, [cartItems, username]);

  useEffect(() => {
    fetch('http://127.0.0.1:8080/goods', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    })
      .then((res) => res.json())
      .then((data: Product[]) => setCards(data))
      .catch((error) => console.error('Ошибка:', error))
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogin = (login: string) => {
    fetch(`http://127.0.0.1:8080/cart/${login}`)
      .then((r) => r.json())
      .then((data) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', login);
        setIsLoggedIn(true);
        setUsername(login);
        setCartItems(data.cart ?? []);
      })
      .catch(() => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', login);
        setIsLoggedIn(true);
        setUsername(login);
        setCartItems([]);
      });
  };

  const handleLogout = () => {
    fetch('http://127.0.0.1:8080/cart/save', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, cart: cartItems}),
    }).finally(() => {
      localStorage.removeItem(`cart_${username}`);
      localStorage.removeItem('username');
      localStorage.removeItem('isLoggedIn');
      setIsLoggedIn(false);
      setUsername('');
      setCartItems([]);
    });
  };

  const addToCart = (item: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? {...i, quantity: i.quantity + 1} : i,
        );
      }
      return [...prev, {id: item.id, name: item.name, quantity: 1}].sort(
        (a, b) => a.id - b.id,
      );
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return prev.filter((i) => i.id !== id);
      }
      return prev.map((i) =>
        i.id === id ? {...i, quantity: i.quantity - 1} : i,
      );
    });
  };

  if (!['/', '/catalog', '/cart', '/profile'].includes(location.pathname)) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={<HomePage data={cards} isLoading={isLoading} />}
          />
          <Route
            path="/catalog"
            element={
              <CatalogPage
                cards={cards}
                cartItems={cartItems}
                setCards={setCards}
                isLoading={isLoading}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                username={username}
                cards={cards}
                cartItems={cartItems}
                setCartItems={setCartItems}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                onOrderComplete={() => setCartItems([])}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <ProfilePage
                onLogin={handleLogin}
                setActiveItem={setActiveItem}
              />
            }
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
