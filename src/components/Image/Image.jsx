import style from './Image.module.css';

const Image = ({ image }) => {
  const handleClick = () => {};

  return (
    <div className={`${style.image_container} `}>
      <img
        src={image.src}
        className={`${style.image} `}
        alt={image.alt.trim().length ? image.alt : ''}
      />
    </div>
  );
};

export default Image;
