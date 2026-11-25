export default function Labels({isHit, isNew}) {
  if (!isHit && !isNew) {
    return null;
  }
  return (
    <span className="labels">
      {isNew && <span className="label label-new">Новинка</span>}
      {isHit && <span className="label label-hit">Хит</span>}
    </span>
  );
}
