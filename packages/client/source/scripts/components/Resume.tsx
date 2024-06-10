import type {SyntheticEvent} from 'react';
import React, {useState} from 'react';
import styled from 'styled-components';

const en = new URL('../../pdf/resume_e_May24.pdf', import.meta.url).href;
const ja = new URL('../../pdf/resume_j_May24.pdf', import.meta.url).href;

const Tabs = styled.div`
  position: relative;
  text-align: center;
  .tab {
    display: inline-block;
    height: 50px;
    line-height: 50px;
    font-size: 22px;
    width: 300px;
    cursor: pointer;
    [type='radio'] {
      display: none;
    }
    &.active {
      background-color: #535659;
      cursor: default;
    }
    label {
      cursor: pointer;
    }
  }
`;

const Resume: React.FunctionComponent = () => {
  const [active, setActive] = useState<number>(0);
  const handleClick: (e: SyntheticEvent) => void = (e: SyntheticEvent) => {
    const index = parseInt((e.target as Element).id, 2);
    if (index !== active) {
      return setActive(index);
    }
  };

  return (
    <div className={'h100'}>
      <Tabs className={'tabs'}>
        <div
          className={active === 0
            ? ['tab', 'active'].join(' ')
            : 'tab'}
        >
          <input
            type="radio"
            id="0"
            name="resume"
            onClick={handleClick}
          />
          <label htmlFor="0">english</label>
        </div>
        <div
          className={active === 1
            ? ['tab', 'active'].join(' ')
            : 'tab'}>
          <input
            type="radio"
            id="1"
            name="resume"
            onClick={handleClick}
          />
          <label htmlFor="1">japanese</label>
        </div>
      </Tabs>
      <div style={{height: '100%'}}>
        {active === 0 ? (
          <object
            data={en}
            type={'application/pdf'}
            width={'100%'}
            height={'100%'}

          >
          </object>
        ) : (
          <object
            data={ja}
            type={'application/pdf'}
            width={'100%'}
            height={'100%'}
          >
          </object>
        )}
      </div>
    </div>
  );
};

export default Resume;
