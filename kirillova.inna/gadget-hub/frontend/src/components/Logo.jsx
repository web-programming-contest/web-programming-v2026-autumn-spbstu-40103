import {Link} from 'react-router-dom';

function Logo({variant = 'dark'}) {
  return (
    <Link to="/" className={`logo logo--${variant}`}>
      <span className="logo__accent">Gadget</span> Hub
    </Link>
  );
}

export default Logo;
