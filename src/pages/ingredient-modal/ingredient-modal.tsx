import IngredientDetails from '@/components/ingredient-details/ingredient-details';
import Modal from '@/components/modal/modal';
import { useGetIngredientsQuery } from '@/utils/api/api';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useNavigate, useParams } from 'react-router-dom';

export default function IngredientModal(): React.JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: ingredients = [], isLoading, isError } = useGetIngredientsQuery();

  function handleClose(): void {
    void navigate('/');
  }

  const ingredient = ingredients.find((item) => item._id === id);

  return (
    <Modal header="Детали ингредиента" onClose={handleClose}>
      {isLoading ? (
        <Preloader />
      ) : isError ? (
        <p>Ошибка при получении данных ингредиента.</p>
      ) : ingredient ? (
        <IngredientDetails props={ingredient} />
      ) : (
        <p>Ингредиент не найден.</p>
      )}
    </Modal>
  );
}
