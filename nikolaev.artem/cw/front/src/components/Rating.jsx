import {StarIcon} from './Icons'

export default function Rating({value}) {
  if (!value) {
    return null
  }
  return (
    <div className="rating" aria-label={`Рейтинг ${value}`}>
      <StarIcon className="rating__star" />
      <span>{String(value).replace('.', ',')}</span>
    </div>
  )
}
