import { useEffect } from 'react';
import { addImagClickListener, startObserver } from '../../helpers/changeAlt';
import ImgContainer from '../ImgContainer/imgContainer';
import style from './App.module.css';


const App = () => {

  useEffect(() => {
    startObserver();
    addImagClickListener()
  }, []);

  return (
    <>
      <header className={style.header}>
        <h1>Test Pictures</h1>
      </header>
      <ImgContainer />
    </>
  );
};

export default App;
