import { updateAllImgAltAttributes } from '../../helpers/changeAlt';
import style from './Button.module.css';

const Button = () => {
  const handleButton = () => {
    updateAllImgAltAttributes();
  };
    
  return (
    <button type='button' className={style.button} onClick={handleButton}>
      Click Me for change Alt in all Images
    </button>
  );
};

export default Button;
