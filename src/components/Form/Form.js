import React, {useState} from 'react';
import axios from 'axios'
import {buttonText, errorData, successData} from "../../utils/Utils";
import 'react-dropdown/style.css';

const Form = () => {
  let chosen = null;
  const [data, changeData] = useState({});
  const [text, changeText] = useState('fill');
  const [chosenParams, changeChosenParams] = useState(null)

  const getData = () => {
    axios.get('')
      .then((res) => changeData(JSON.parse(res)))
      .catch(() => {
        if (Math.random() * 2 < 1) {
          changeData(successData);
          changeText('send');
        } else {
          changeData(errorData);
          changeText('fill');
        }
      })
  }

  const sendRequest = () => {
    switch (text) {
      case "fill":
        changeChosenParams(null);
        getData();
        break;
      case "send" :
        if (!chosen) {
          chosen = data.items[0];
        }
        changeChosenParams(chosen);
        changeText('change');
        console.log(`${chosen.name} (id# ${chosen.id}) `);
        break;
      case "change" :
        changeChosenParams(null);
        getData();
        changeText('send');
        break;
    }

  }

  const choseSearchRequest = ({target}) => {
    chosen = (data.items.filter((item) => item.id == target.getAttribute('data-key'))[0]);
    for (let el of document.getElementsByClassName('red')) {
      el.classList.remove('red');
    }
    target.classList.add('red');
  }

  return <>

    {chosenParams
      ? <div className='chosenParams'>
        <div>критерии поиска:</div>
        <div>Список: {chosenParams.name} (id# {chosenParams.id})</div>
        <div>Запрос: Строка с текстом</div>
      </div>
      : data.items
        ? data.items.map((item) => (
          <div key={item.id} data-key={item.id} onClick={choseSearchRequest}>{item.name} (id# {item.id})</div>))
        : data.error
          ? <div>{data.error}</div>
          : <div>критерии поиска: не установленны</div>
    }
    <button onClick={sendRequest}>{buttonText[text]}</button>
  </>
}

export default Form