import { selectIngredient, clearSelectedIngredient } from '@/utils/ingredientsSlice';
import { Tab, Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useState, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import IngredientDetails from '../ingredient-details/ingredient-details';
import Modal from '../modal/modal';

import type { RootState } from '@/utils/api/store';
import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TDraggableIngredientProps = {
  ingredient: TIngredient;
  onClick: () => void;
};
const DraggableIngredient = ({
  ingredient,
  onClick,
}: TDraggableIngredientProps): React.JSX.Element => {
  const [, dragRef] = useDrag<TIngredient>(() => ({
    type: 'ingredient',
    item: ingredient,
    collect: (monitor): { isDragging: boolean } => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <li
      ref={(node) => {
        dragRef(node);
      }}
      onClick={onClick}
    >
      <img src={ingredient.image} alt={ingredient.name} />

      <Counter count={1} size="default" extraClass="" />

      <div className={styles.menu_item_price}>
        <h3 className="text text_type_main-default">{ingredient.price}</h3>
        <CurrencyIcon type="primary" />
      </div>

      <span>{ingredient.name}</span>
    </li>
  );
};

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const dispatch = useDispatch();
  const selectedIngredient = useSelector(
    (state: RootState) => state.ingredients.selectedIngredient
  );
  const [currentTab, setCurrentTab] = useState('bun');

  const containerRef = useRef<HTMLElement>(null);
  const bunRef = useRef<HTMLHeadingElement>(null);
  const mainRef = useRef<HTMLHeadingElement>(null);
  const sauceRef = useRef<HTMLHeadingElement>(null);

  function handleIngredientClick(ingredient: TIngredient): void {
    dispatch(selectIngredient(ingredient));
  }

  function handleModalClose(): void {
    dispatch(clearSelectedIngredient());
  }

  function handleTabClick(tab: 'bun' | 'main' | 'sauce'): void {
    const tabRefs = {
      bun: bunRef,
      main: mainRef,
      sauce: sauceRef,
    };

    tabRefs[tab].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  function handleScroll(): void {
    if (
      !containerRef.current ||
      !bunRef.current ||
      !sauceRef.current ||
      !mainRef.current
    ) {
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const bunRect = bunRef.current.getBoundingClientRect();
    const sauceRect = sauceRef.current.getBoundingClientRect();
    const mainRect = mainRef.current.getBoundingClientRect();

    const bunDistance = Math.abs(bunRect.top - containerRect.top);
    const sauceDistance = Math.abs(sauceRect.top - containerRect.top);
    const mainDistance = Math.abs(mainRect.top - containerRect.top);

    const minDistance = Math.min(bunDistance, sauceDistance, mainDistance);
    console.log(minDistance);

    if (minDistance === bunDistance) {
      setCurrentTab('bun');
    } else if (minDistance === sauceDistance) {
      setCurrentTab('sauce');
    } else {
      setCurrentTab('main');
    }
  }

  const buns = ingredients.filter((ingredient) => ingredient.type === 'bun');
  const mains = ingredients.filter((ingredient) => ingredient.type === 'main');
  const sauces = ingredients.filter((ingredient) => ingredient.type === 'sauce');

  return (
    <>
      <section className={styles.burger_ingredients}>
        <nav>
          <ul className={styles.menu}>
            <Tab
              value="bun"
              active={currentTab === 'bun'}
              onClick={() => {
                handleTabClick('bun');
              }}
            >
              Булки
            </Tab>
            <Tab
              value="main"
              active={currentTab === 'main'}
              onClick={() => {
                handleTabClick('main');
              }}
            >
              Начинки
            </Tab>
            <Tab
              value="sauce"
              active={currentTab === 'sauce'}
              onClick={() => {
                handleTabClick('sauce');
              }}
            >
              Соусы
            </Tab>
          </ul>
        </nav>

        <main ref={containerRef} className="custom-scroll" onScroll={handleScroll}>
          <div className={styles.menu_section}>
            <h2 ref={bunRef} className="text text_type_main-medium">
              Булки
            </h2>
            <ul className={styles.menu_section_block}>
              {buns.map((bun) => (
                <DraggableIngredient
                  key={bun._id}
                  ingredient={bun}
                  onClick={() => handleIngredientClick(bun)}
                />
              ))}
            </ul>
          </div>

          <div className={styles.menu_section}>
            <h2 ref={mainRef} className="text text_type_main-medium">
              Начинки
            </h2>
            <ul className={styles.menu_section_block}>
              {mains.map((main) => (
                <DraggableIngredient
                  key={main._id}
                  ingredient={main}
                  onClick={() => handleIngredientClick(main)}
                />
              ))}
            </ul>
          </div>

          <div className={styles.menu_section}>
            <h2 ref={sauceRef} className="text text_type_main-medium">
              Соусы
            </h2>
            <ul className={styles.menu_section_block}>
              {sauces.map((sauce) => (
                <DraggableIngredient
                  key={sauce._id}
                  ingredient={sauce}
                  onClick={() => handleIngredientClick(sauce)}
                />
              ))}
            </ul>
          </div>
        </main>
      </section>

      {selectedIngredient && (
        <Modal header="Детали ингредиента" onClose={handleModalClose}>
          <IngredientDetails props={selectedIngredient} />
        </Modal>
      )}
    </>
  );
};
