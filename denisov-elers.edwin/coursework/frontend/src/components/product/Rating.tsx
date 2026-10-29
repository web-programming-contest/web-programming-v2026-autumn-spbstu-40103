import {asset} from '../../utils/assets';

export function Rating({value}: {value: number}) {
  return (
    <div className="rating" aria-label={`Рейтинг ${value} из 5`}>
      <img src={asset('star-icon.svg')} alt="" width="20" height="20" />
      {value.toLocaleString('ru-RU')}
    </div>
  );
}
