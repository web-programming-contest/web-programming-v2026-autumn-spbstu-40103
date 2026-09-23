import {asset} from '../../utils/assets';

const advantages = [
  ['rocket-icon.svg', 'Утром заказали, вечером получили'],
  ['rouble-icon.svg', 'С товаром что-то не так? Вернем деньги'],
  ['license-icon.svg', 'Только оригинальные товары'],
];

export function Advantages() {
  return (
    <section className="advantages">
      <h2>Преимущества</h2>
      <div>
        {advantages.map(([src, text]) => (
          <article key={src}>
            <img src={asset(src)} width="72" height="72" alt="" />
            <h3>{text}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
