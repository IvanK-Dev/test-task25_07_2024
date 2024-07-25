import structure from '../../assets/structure.json';
import Image from '../Image/Image';
import style from './imgContainer.module.css';
import { nanoid } from 'nanoid';

const ImgContainer = () => {
  const structReader = (data, level = 0) => {
    const className = style[`nesting${level}`];
    return (
      <div key={nanoid()} className={`${className}`}>
        {data.map((item, index) => {
          if (Array.isArray(item)) {
            return structReader(item, level + 1);
          } else {
              return <Image key={nanoid()} image={ item}  />;
          }
        })}
      </div>
    );
  };

  return <div className={style.container}>{structReader(structure)}</div>;
};

export default ImgContainer;
